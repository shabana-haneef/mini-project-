const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const peerTeachingRoutes = require('./routes/peerTeachingRoutes');
const clubRoutes = require('./routes/clubProfileRoutes');
const academicRoutes = require('./routes/academicRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const academicContentRoutes = require('./routes/academicContentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const activityPostRoutes = require('./routes/activityPostRoutes');
const teamMemberRoutes = require('./routes/teamMemberRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Configure app
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
    credentials: true
}));
app.use(express.json({ limit: '1GB' }));
app.use(express.urlencoded({ limit: '1GB', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/peer-teaching', peerTeachingRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/academic-content', academicContentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity-posts', activityPostRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
        server.timeout = 1800000;
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/test-debug', (req, res) => {
    res.json({ message: 'Debug OK' });
});

// Start at bottom if needed

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error('GLOBAL ERROR:', err);
    console.error('Path:', req.path);
    console.error('Method:', req.method);

    // Debug to file
    try {
        const fs = require('fs');
        const path = require('path');
        const errorLog = `${new Date().toISOString()} - ${req.method} ${req.path} - ${err.message}\n${err.stack}\n\n`;
        fs.appendFileSync(path.join(__dirname, 'debug_error.log'), errorLog);
    } catch (e) {
        console.error('Failed to write to debug log:', e);
    }

    res.status(statusCode).json({
        message: err.message || err.toString(),
        rawError: JSON.stringify(err, Object.getOwnPropertyNames(err))
    });
});
// Nodemon restart trigger
