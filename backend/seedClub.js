const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });
const User = require('./models/userModel');
const ClubProfile = require('./models/clubProfileModel');

const seedClub = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const clubEmail = 'clubadmin@test.com'; 
        const clubPass = 'password123';

        let clubUser = await User.findOne({ email: clubEmail });

        if (!clubUser) {
            console.log('No club user found. Creating one...');
            
            clubUser = await User.create({
                name: 'Test Club Admin',
                email: clubEmail,
                password: clubPass, // Pre-save hook will hash it
                role: 'club',
                isVerified: true
            });
            console.log('Club user created successfully');

            await ClubProfile.create({
                user: clubUser._id,
                category: 'Technical',
                description: 'A test technical club for QA testing.',
                location: 'Main Campus',
                coordinators: [],
            });
            console.log('Club profile created successfully');
        } else {
            console.log('Club user already exists:', clubUser.email);
            // Updating password triggers pre-save hash
            clubUser.password = clubPass;
            clubUser.isVerified = true;
            await clubUser.save();
        }

        console.log('\n--- CLUB CREDENTIALS ---');
        console.log('Email:', clubUser.email);
        console.log('Password (If new):', clubPass);
        console.log('--------------------------\n');

        process.exit();
    } catch (error) {
        console.error('Error seeding club:', error);
        process.exit(1);
    }
};

seedClub();
