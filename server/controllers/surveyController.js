const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Get all surveys for current admin
exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find({ admin: req.adminId })
            .notDeleted()
            .sort({ createdAt: -1 });

        res.json({ surveys });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get single survey with questions and answers
exports.getSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).notDeleted();

        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        // Get questions
        const questions = await Question.find({ survey: req.params.id })
            .sort({ order: 1 });

        // Get answers for each question
        const questionsWithAnswers = await Promise.all(
            questions.map(async (question) => {
                const answers = await Answer.find({ question: question._id })
                    .sort({ order: 1 });
                return {
                    ...question.toObject(),
                    answers
                };
            })
        );

        res.json({
            survey,
            questions: questionsWithAnswers
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get public survey (for respondents)
exports.getPublicSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).notDeleted();

        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        if (survey.status !== 'active') {
            return res.status(403).json({ error: 'Khảo sát không khả dụng' });
        }

        // Get questions with answers
        const questions = await Question.find({ survey: req.params.id })
            .sort({ order: 1 });

        const questionsWithAnswers = await Promise.all(
            questions.map(async (question) => {
                const answers = await Answer.find({ question: question._id })
                    .sort({ order: 1 });
                return {
                    ...question.toObject(),
                    answers
                };
            })
        );

        res.json({
            survey: {
                _id: survey._id,
                title: survey.title,
                description: survey.description,
                settings: survey.settings
            },
            questions: questionsWithAnswers
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Create survey with questions and answers
exports.createSurvey = async (req, res) => {
    try {
        const { title, description, status, questions } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Tiêu đề là bắt buộc' });
        }

        if (!questions || questions.length === 0) {
            return res.status(400).json({ error: 'Khảo sát phải có ít nhất một câu hỏi' });
        }

        // Create survey
        const survey = new Survey({
            admin: req.adminId,
            title: title.trim(),
            description: description?.trim(),
            status: status || 'active'
        });

        await survey.save();

        console.log('Survey created:', survey._id); // Debug log

        // Create questions and answers
        const createdQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            const qData = questions[i];

            const question = new Question({
                survey: survey._id,
                type: qData.type,
                question: qData.question,
                required: qData.required || false,
                order: i,
                tableConfig: qData.tableConfig
            });

            await question.save();
            console.log('Question created:', question._id); // Debug log

            // Create answers for radio/checkbox questions
            const questionAnswers = [];
            if ((qData.type === 'radio' || qData.type === 'checkbox') && qData.options) {
                for (let j = 0; j < qData.options.length; j++) {
                    const option = qData.options[j];
                    const answer = new Answer({
                        question: question._id,
                        label: option.label,
                        value: option.value || option.label,
                        order: j
                    });
                    await answer.save();
                    questionAnswers.push(answer);
                    console.log('Answer created:', answer._id); // Debug log
                }
            }

            // Add to created questions array
            createdQuestions.push({
                ...question.toObject(),
                answers: questionAnswers
            });
        }

        console.log('Total questions created:', createdQuestions.length); // Debug log

        res.status(201).json({
            message: 'Tạo khảo sát thành công',
            survey: {
                _id: survey._id,
                title: survey.title,
                description: survey.description,
                status: survey.status
            },
            questions: createdQuestions // Return questions with _id
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Update survey
exports.updateSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).notDeleted();

        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        // Check ownership
        if (survey.admin.toString() !== req.adminId) {
            return res.status(403).json({ error: 'Không có quyền chỉnh sửa' });
        }

        const { title, description, status, questions } = req.body;

        // Update survey info
        if (title) survey.title = title.trim();
        if (description !== undefined) survey.description = description?.trim();
        if (status) survey.status = status;

        await survey.save();

        // Update questions if provided
        if (questions) {
            // Delete old questions and answers
            const oldQuestions = await Question.find({ survey: survey._id });
            for (const q of oldQuestions) {
                await Answer.deleteMany({ question: q._id });
            }
            await Question.deleteMany({ survey: survey._id });

            // Create new questions and answers
            for (let i = 0; i < questions.length; i++) {
                const qData = questions[i];

                const question = new Question({
                    survey: survey._id,
                    type: qData.type,
                    question: qData.question,
                    required: qData.required || false,
                    order: i,
                    tableConfig: qData.tableConfig
                });

                await question.save();

                if ((qData.type === 'radio' || qData.type === 'checkbox') && qData.options) {
                    for (let j = 0; j < qData.options.length; j++) {
                        const option = qData.options[j];
                        const answer = new Answer({
                            question: question._id,
                            label: option.label,
                            value: option.value || option.label,
                            order: j
                        });
                        await answer.save();
                    }
                }
            }
        }

        res.json({
            message: 'Cập nhật khảo sát thành công',
            survey
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Delete survey (soft delete)
exports.deleteSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).notDeleted();

        if (!survey) {
            return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
        }

        // Check ownership
        if (survey.admin.toString() !== req.adminId) {
            return res.status(403).json({ error: 'Không có quyền xóa' });
        }

        await survey.softDelete();

        res.json({ message: 'Xóa khảo sát thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
