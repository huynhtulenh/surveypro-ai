const Response = require('../models/Response');
const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Submit response
exports.submitResponse = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const { answers, respondent } = req.body;

        // Validate survey
        const survey = await Survey.findById(surveyId).notDeleted();
        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        if (survey.status !== 'active') {
            return res.status(403).json({ error: 'Khảo sát không khả dụng' });
        }

        // Log incoming data for debugging
        console.log('Submit response - Survey ID:', surveyId);
        console.log('Submit response - Answers count:', answers?.length);
        if (answers && answers.length > 0) {
            console.log('First answer:', answers[0]);
        }

        // Create response
        const response = new Response({
            survey: surveyId,
            respondent,
            answers: answers.map(ans => ({
                question: ans.question || ans.questionId, // Support both field names
                textAnswer: ans.textAnswer,
                selectedAnswer: ans.selectedAnswer,
                selectedAnswers: ans.selectedAnswers,
                tableAnswers: ans.tableAnswers
            })),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        console.log('Response object created, saving...'); // Debug

        await response.save();

        res.status(201).json({
            message: 'Gửi câu trả lời thành công',
            response: {
                _id: response._id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get all responses for a survey
exports.getSurveyResponses = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const responses = await Response.find({ survey: surveyId })
            .populate('answers.question')
            .populate('answers.selectedAnswer')
            .populate('answers.selectedAnswers')
            .sort({ createdAt: -1 });

        res.json({ responses });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get analytics for a survey
exports.getSurveyAnalytics = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const survey = await Survey.findById(surveyId).notDeleted();
        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        const responses = await Response.find({ survey: surveyId })
            .populate('answers.question')
            .populate('answers.selectedAnswer')
            .populate('answers.selectedAnswers');

        const questions = await Question.find({ survey: surveyId }).sort({ order: 1 });

        // Calculate analytics for each question
        const analytics = await Promise.all(
            questions.map(async (question) => {
                const questionResponses = responses.map(r =>
                    r.answers.find(a => a.question._id.toString() === question._id.toString())
                ).filter(Boolean);

                if (question.type === 'radio' || question.type === 'checkbox') {
                    // Count answer selections
                    const counts = {};
                    const answers = await Answer.find({ question: question._id });

                    answers.forEach(ans => {
                        counts[ans.label] = 0;
                    });

                    questionResponses.forEach(qr => {
                        if (question.type === 'radio' && qr.selectedAnswer) {
                            const label = qr.selectedAnswer.label;
                            counts[label] = (counts[label] || 0) + 1;
                        } else if (question.type === 'checkbox' && qr.selectedAnswers) {
                            qr.selectedAnswers.forEach(ans => {
                                const label = ans.label;
                                counts[label] = (counts[label] || 0) + 1;
                            });
                        }
                    });

                    return {
                        question: question.question,
                        type: question.type,
                        counts,
                        totalResponses: questionResponses.length
                    };
                } else if (question.type === 'text' || question.type === 'date') {
                    return {
                        question: question.question,
                        type: question.type,
                        answers: questionResponses.map(qr => qr.textAnswer),
                        totalResponses: questionResponses.length
                    };
                } else if (question.type === 'table-single' || question.type === 'table-multiple') {
                    const tableCounts = {};

                    questionResponses.forEach(qr => {
                        if (qr.tableAnswers) {
                            const tableData = qr.tableAnswers;
                            for (const [row, value] of Object.entries(tableData)) {
                                if (!tableCounts[row]) {
                                    tableCounts[row] = {};
                                }
                                if (Array.isArray(value)) {
                                    value.forEach(v => {
                                        tableCounts[row][v] = (tableCounts[row][v] || 0) + 1;
                                    });
                                } else {
                                    tableCounts[row][value] = (tableCounts[row][value] || 0) + 1;
                                }
                            }
                        }
                    });

                    return {
                        question: question.question,
                        type: question.type,
                        tableCounts,
                        totalResponses: questionResponses.length
                    };
                }

                return {
                    question: question.question,
                    type: question.type,
                    totalResponses: questionResponses.length
                };
            })
        );

        res.json({
            analytics: {
                totalResponses: responses.length,
                questions: analytics
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Export responses to CSV
exports.exportResponses = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const survey = await Survey.findById(surveyId).notDeleted();
        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        const responses = await Response.find({ survey: surveyId })
            .populate('answers.question')
            .populate('answers.selectedAnswer')
            .populate('answers.selectedAnswers')
            .sort({ createdAt: 1 });

        const questions = await Question.find({ survey: surveyId }).sort({ order: 1 });

        // Build CSV header
        let csv = 'Timestamp,Email,Name';
        questions.forEach(q => {
            csv += `,"${q.question.replace(/"/g, '""')}"`;
        });
        csv += '\n';

        // Build CSV rows
        responses.forEach(response => {
            const row = [
                new Date(response.createdAt).toISOString(),
                response.respondent?.email || '',
                response.respondent?.name || ''
            ];

            questions.forEach(question => {
                const answer = response.answers.find(a =>
                    a.question._id.toString() === question._id.toString()
                );

                let value = '';
                if (answer) {
                    if (answer.textAnswer) {
                        value = answer.textAnswer;
                    } else if (answer.selectedAnswer) {
                        value = answer.selectedAnswer.label;
                    } else if (answer.selectedAnswers && answer.selectedAnswers.length > 0) {
                        value = answer.selectedAnswers.map(a => a.label).join(', ');
                    } else if (answer.tableAnswers) {
                        value = JSON.stringify(Object.fromEntries(answer.tableAnswers));
                    }
                }

                row.push(`"${value.replace(/"/g, '""')}"`);
            });

            csv += row.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="survey-${surveyId}-responses.csv"`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
