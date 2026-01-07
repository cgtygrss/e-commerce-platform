const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name: firstName,
            surname: lastName,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                surname: user.surname,
                email: user.email, 
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                surname: user.surname,
                email: user.email, 
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            // Use 'sub' as a dummy password or handle passwordless differently
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(sub + Math.random().toString(), salt);

            user = new User({
                name: name.split(' ')[0] || name,
                surname: name.split(' ').slice(1).join(' ') || '',
                email,
                password: hashedPassword
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                name: user.name, 
                surname: user.surname,
                email: user.email, 
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin 
            } 
        });
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(500).json({ message: 'Google authentication failed' });
    }
});

const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.surname = req.body.surname || user.surname;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.gender = req.body.gender || user.gender;
            user.birthDate = req.body.birthDate || user.birthDate;
            
            if (req.body.address) {
                user.address = {
                    street: req.body.address.street || user.address?.street || '',
                    city: req.body.address.city || user.address?.city || '',
                    postalCode: req.body.address.postalCode || user.address?.postalCode || '',
                    country: req.body.address.country || user.address?.country || ''
                };
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                surname: updatedUser.surname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                birthDate: updatedUser.birthDate,
                address: updatedUser.address,
                isAdmin: updatedUser.isAdmin
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
