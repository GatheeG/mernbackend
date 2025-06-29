const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create Token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.signUp(name, email, password);
        const token = createToken(user._id);

        res.status(201).json({
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.status(200).json({
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };
