const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./server/config');

// Import routes
const surveyRoutes = require('./server/routes/surveys');
const responseRoutes = require('./server/routes/responses');
const companyRoutes = require('./server/routes/companies');
const adminRoutes = require('./server/routes/admins');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admins', adminRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin Dashboard (manages surveys)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/create-survey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-survey.html'));
});

app.get('/survey/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'take-survey.html'));
});

app.get('/analytics/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'analytics.html'));
});

// Admin pages
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-register.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Connect to MongoDB
mongoose.connect(config.mongoUri)
    .then(() => {
        console.log('✅ Kết nối MongoDB thành công');

        // Start server
        app.listen(config.port, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${config.port}`);
        });
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối MongoDB:', err.message);
        process.exit(1);
    });

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Đã xảy ra lỗi server!' });
});
