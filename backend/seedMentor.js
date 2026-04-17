const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const User = require('./models/userModel');
const Mentor = require('./models/mentorModel');

const seedMentor = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const mentorEmail = 'mentor@test.com'; 
        const mentorPass = 'password123';

        let mentor = await User.findOne({ email: mentorEmail });

        if (!mentor) {
            console.log('No mentor found. Creating one...');

            mentor = await User.create({
                name: 'Test Mentor',
                email: mentorEmail,
                password: mentorPass, // Don't hash here, pre-save will handle it
                role: 'mentor',
                isVerified: true
            });
            console.log('Mentor created successfully');
            
            await Mentor.create({
                user: mentor._id,
                institution: 'Test Institute',
                stream: 'Testing',
                scheme: 'QA Scheme'
            });
        } else {
            console.log('Mentor already exists:', mentor.email);
            // Updating password triggers pre-save hash if isModified('password') is true
            mentor.password = mentorPass;
            mentor.isVerified = true;
            await mentor.save();
        }

        console.log('\n--- MENTOR CREDENTIALS ---');
        console.log('Email:', mentor.email);
        console.log('Password (If new):', mentorPass);
        console.log('--------------------------\n');

        process.exit();
    } catch (error) {
        console.error('Error seeding mentor:', error);
        process.exit(1);
    }
};

seedMentor();
