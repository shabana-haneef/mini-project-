const Event = require('../models/eventModel');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Coordinator/Admin)
const createEvent = async (req, res) => {
    try {
        const { title, description, clubName, date, time, venue, capacity } = req.body;
        const posterImage = req.file ? req.file.path : '';

        const event = await Event.create({
            title,
            description,
            clubName,
            coordinator: req.user._id,
            date,
            time,
            venue,
            capacity,
            posterImage,
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all approved events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved' }).populate('coordinator', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events for admin (including pending)
// @route   GET /api/events/admin
// @access  Private (Admin)
const getAllEventsForAdmin = async (req, res) => {
    try {
        const events = await Event.find({}).populate('coordinator', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events strictly for the logged-in club/coordinator
// @route   GET /api/events/manage
// @access  Private (Club/Coordinator)
const getClubEvents = async (req, res) => {
    try {
        // Fetch events securely isolated to the requesting club
        const events = await Event.find({ coordinator: req.user._id }).populate('coordinator', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('coordinator', 'name email');
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event status (Approval workflow)
// @route   PUT /api/events/:id/status
// @access  Private (Admin)
const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const event = await Event.findById(req.params.id);

        if (event) {
            event.status = status;
            const updatedEvent = await event.save();

            // Trigger notification only if approved
            if (status === 'approved') {
                // Subscription notifications removed
            }

            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private (Student)
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.registrations.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        if (event.registrations.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is at full capacity' });
        }

        event.registrations.push(req.user._id);
        await event.save();

        res.json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Club/Coordinator)
const updateEvent = async (req, res) => {
    try {
        const { title, description, clubName, date, time, venue, capacity } = req.body;
        const posterImage = req.file ? req.file.path : undefined;

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Must be the owner or superadmin
        if (event.coordinator.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized to modify this event.' });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.clubName = clubName || event.clubName;
        event.date = date || event.date;
        event.time = time || event.time;
        event.venue = venue || event.venue;
        event.capacity = capacity || event.capacity;
        
        if (posterImage) {
            event.posterImage = posterImage;
        }

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Club/Coordinator)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Must be the owner or superadmin
        if (event.coordinator.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized to delete this event.' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getAllEventsForAdmin,
    getClubEvents,
    getEventById,
    updateEventStatus,
    registerForEvent,
    updateEvent,
    deleteEvent,
};
