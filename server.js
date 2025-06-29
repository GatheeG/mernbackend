require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require('./db');
const workoutsRouter = require('./routes/workouts');
const authRouter = require('./routes/user');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// API Routes
app.use('/api/workouts', workoutsRouter);
app.use('/api/auth', authRouter);

// Default route for testing
app.get('/', (req, res) => {
    res.send('✅ API is running...');
});

// Start server
const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

startServer();
