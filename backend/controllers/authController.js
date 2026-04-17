const User = require('../models/userModel');
const ClubProfile = require('../models/clubProfileModel');
const Mentor = require('../models/mentorModel');
const generateToken = require('../config/generateToken');
const crypto = require('crypto');


const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('--- LOGIN ATTEMPT ---');
        console.log('Email:', email);
        
        const user = await User.findOne({ email });
        console.log('User search result:', user ? 'User Found' : 'User NOT Found');

        if (user) {
            console.log('Attempting password match...');
            const isMatch = await user.matchPassword(password);
            console.log('Password match result:', isMatch);

            if (isMatch) {
                console.log('Generating token...');
                generateToken(res, user._id);
                console.log('Token generated. Sending response...');
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                    skills: user.skills,
                    github: user.github,
                    linkedin: user.linkedin,
                });
                return;
            }
        }
        
        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('CRITICAL LOGIN ERROR:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ 
            message: 'Internal Server Error during login', 
            error: error.message 
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, category, institution, stream, scheme } = req.body;
        console.log('--- SIGNUP INITIATED ---');
        console.log('Role:', role, 'Email:', email);

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Signup failed: user already exists');
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        console.log('Creating User...');
        const user = await User.create({ 
            name, 
            email, 
            password, 
            role, 
            isVerified: true
        });

        if (user) {
            console.log('User created:', user._id);
            
            // Handle dependent profiles
            if (role === 'club') {
                await ClubProfile.create({
                    user: user._id,
                    category: category || 'General',
                    description: 'Welcome to our club!',
                    location: 'Main Campus',
                    coordinators: [],
                });
            } else if (role === 'mentor') {
                await Mentor.create({
                    user: user._id,
                    institution: institution || 'Unknown',
                    stream: stream || 'General',
                    scheme: scheme || 'General',
                });
            }

            res.status(201).json({
                message: 'Registration successful! You can now log in.',
                email: user.email,
            });
        }
    } catch (error) {
        console.error('--- SIGNUP CRASH ---');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        const statusCode = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500;
        res.status(statusCode).json({ 
            message: 'Internal Server Error during signup', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        console.log('--- PROFILE UPDATE ATTEMPT ---');
        console.log('User ID from Token:', req.user?._id);
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file ? 'File present' : 'No file');

        const user = await User.findById(req.user._id);

        if (user) {
            // Explicitly check for defined fields in req.body
            // Using check !== undefined allows for empty string updates
            if (req.body.name !== undefined) user.name = req.body.name;
            if (req.body.email !== undefined) user.email = req.body.email;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            if (req.body.skills !== undefined) user.skills = req.body.skills;
            if (req.body.github !== undefined) user.github = req.body.github;
            if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
            
            if (req.file) {
                console.log('Updating profile picture to:', req.file.path);
                user.profilePicture = req.file.path;
            }

            if (req.body.password) {
                console.log('Password update requested');
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            console.log('Profile updated successfully for user:', updatedUser._id);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                github: updatedUser.github,
                linkedin: updatedUser.linkedin,
            });
        } else {
            console.log('Profile update failed: User not found in DB');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('--- PROFILE UPDATE ERROR ---');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`));
        }
        res.status(400).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};



module.exports = {
    authUser,
    registerUser,
    logoutUser,
    updateUserProfile,
};
