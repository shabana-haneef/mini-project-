const AcademicStructure = require('../models/academicModel');

// @desc    Get all unique universities
// @route   GET /api/academic/universities
// @access  Public
const getUniversities = async (req, res) => {
    const universities = await AcademicStructure.distinct('university');
    res.json(universities);
};

// @desc    Get schemes for a university
// @route   GET /api/academic/schemes
// @access  Public
const getSchemes = async (req, res) => {
    const { university } = req.query;
    const schemes = await AcademicStructure.find({ university }).distinct('scheme');
    res.json(schemes);
};

// @desc    Get streams for a university/scheme
// @route   GET /api/academic/streams
// @access  Public
const getStreams = async (req, res) => {
    const { university, scheme } = req.query;
    const streams = await AcademicStructure.find({ university, scheme }).distinct('stream');
    res.json(streams);
};

// @desc    Get semesters for university/scheme/stream
// @route   GET /api/academic/semesters
// @access  Public
const getSemesters = async (req, res) => {
    const { university, scheme, stream } = req.query;
    const semesters = await AcademicStructure.find({ university, scheme, stream }).distinct('semester');
    res.json(semesters.sort((a, b) => a - b));
};

// @desc    Get subjects for specific hierarchy
// @route   GET /api/academic/subjects
// @access  Public
const getSubjects = async (req, res) => {
    const { university, scheme, stream, semester } = req.query;
    const subjects = await AcademicStructure.find({ university, scheme, stream, semester });
    res.json(subjects);
};

// @desc    Seed initial academic data
const seedAcademicData = async (req, res) => {
    const ktuData = [
        { university: 'KTU', scheme: '2019 Scheme', stream: 'Computer Science', year: 3, semester: 6, subjectName: 'Computer Graphics & Image Processing', subjectCode: 'CST304' },
        { university: 'KTU', scheme: '2019 Scheme', stream: 'Computer Science', year: 3, semester: 6, subjectName: 'Algorithm Analysis and Design', subjectCode: 'CST306' },
        { university: 'KTU', scheme: '2019 Scheme', stream: 'Computer Science', year: 3, semester: 6, subjectName: 'Comprehensive Course Work', subjectCode: 'CST308' },
        { university: 'KTU', scheme: '2019 Scheme', stream: 'Computer Science', year: 3, semester: 5, subjectName: 'Formal Languages and Automata Theory', subjectCode: 'CST301' },
    ];

    try {
        await AcademicStructure.insertMany(ktuData);
        res.status(201).json({ message: 'Sample academic data seeded' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getUniversities,
    getSchemes,
    getStreams,
    getSemesters,
    getSubjects,
    seedAcademicData
};
