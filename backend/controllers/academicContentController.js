const AcademicContent = require("../models/academicContentModel");
const AcademicStructure = require("../models/academicModel");
const PaperRequest = require("../models/paperRequestModel");
const Download = require("../models/downloadModel");
const { cloudinary } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { sendBulkNotifications } = require("../utils/notificationUtils");

// @desc    Upload academic content
// @route   POST /api/academic-content
// @access  Private (Mentor)
const uploadContent = async (req, res) => {
  let {
    academicId,
    title,
    description,
    contentType,
    youtubeUrl,
    tags,
    // Manual entry fields
    university,
    scheme,
    stream,
    year,
    semester,
    subjectName,
    subjectCode,
  } = req.body;

  if (
    !academicId &&
    (!university ||
      !scheme ||
      !stream ||
      !year ||
      !semester ||
      !subjectName ||
      !subjectCode)
  ) {
    return res.status(400).json({
      message:
        "Please select a subject or provide all academic details manually.",
    });
  }

  // Validation for file upload based on content type
  if (contentType === "video") {
    if (!req.file && !youtubeUrl) {
      return res
        .status(400)
        .json({ message: "Please provide a video file or YouTube link" });
    }
  } else {
    // For notes, ppt, paper - file is mandatory
    if (!req.file) {
      return res
        .status(400)
        .json({ message: `Please upload a file for ${contentType}` });
    }
  }

  try {
    console.log("--- Upload Content Debug ---");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User ID:", req.user?._id);

    // If manual entry, find or create the academic structure
    if (!academicId) {
      console.log("Attempting to find/create AcademicStructure...");
      let structure = await AcademicStructure.findOne({
        university,
        scheme,
        stream,
        semester,
        subjectCode,
      });

      if (!structure) {
        console.log("Creating new AcademicStructure...");
        structure = await AcademicStructure.create({
          university,
          scheme,
          stream,
          year: Number(year),
          semester: Number(semester),
          subjectName,
          subjectCode,
        });
      }
      academicId = structure._id;
      console.log("Final academicId:", academicId);
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        // Fallback for comma-separated strings if JSON.parse fails
        parsedTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "");
      }
    }

    let fileUrl = "";
    if (req.file) {
      // Direct local file assignment via Multer diskStorage
      console.log("Saving new content using Multer local storage:", req.file.path);

      // Standardize the URL structure. The file is saved inside 'uploads/' directory.
      // E.g., if req.file.filename is 'file-12345.pdf', url will be '/uploads/file-12345.pdf'
      fileUrl = `/uploads/${req.file.filename}`;
      console.log("Local Storage URL:", fileUrl);
    }

    console.log("Creating AcademicContent...");
    const content = await AcademicContent.create({
      mentor: req.user._id,
      academicId,
      title,
      description,
      contentType,
      fileUrl: fileUrl,
      youtubeUrl,
      tags: parsedTags,
    });

    console.log("Content created successfully:", content._id);



    res.status(201).json(content);
  } catch (error) {
    console.error("--- Upload Content Error ---");
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      stack: error.stack,
    });
  }
};

// @desc    Get content by academic subject
// @route   GET /api/academic-content/subject/:subjectId
// @access  Public
const getContentBySubject = async (req, res) => {
  const contents = await AcademicContent.find({
    academicId: req.params.subjectId,
    status: 'active'
  })
    .populate("mentor", "name profilePicture")
    .populate("comments.user", "name profilePicture");
  res.json(contents);
};

// @desc    Search and filter content
// @route   GET /api/academic-content/search
// @access  Public
const searchContent = async (req, res) => {
  const { university, scheme, stream, semester, subject, query, type, mentor } =
    req.query;

  let filter = { status: 'active' };
  if (type) filter.contentType = type;
  if (mentor) filter.mentor = mentor;
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ];
  }

  // Check if hierarchy filters are applied
  const hasHierarchyFilters =
    university || scheme || stream || semester || subject;

  let contents;
  if (hasHierarchyFilters) {
    contents = await AcademicContent.find(filter)
      .populate({
        path: "academicId",
        match: {
          ...(university && { university }),
          ...(scheme && { scheme }),
          ...(stream && { stream }),
          ...(semester && { semester }),
          ...(subject && { subjectName: subject }),
        },
      })
      .populate("mentor", "name")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    contents = contents.filter((c) => c.academicId !== null);
  } else {
    contents = await AcademicContent.find(filter)
      .populate("mentor", "name")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });
  }

  res.json(contents);
};

// @desc    Delete academic content
// @route   DELETE /api/academic-content/:id
// @access  Private (Mentor/Admin)
const deleteContent = async (req, res) => {
  try {
    const content = await AcademicContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check ownership
    // IF role !== mentor Reject request
    // IF role === mentor AND user_id !== uploaded_by_user_id Reject request
    if (req.user.role !== 'mentor' && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only mentors can delete academic content" });
    }

    if (
      content.mentor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this content. You can only delete your own uploads." });
    }

    content.status = 'deleted';
    await content.save();
    res.json({ message: "Content removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create paper request
// @route   POST /api/academic-content/request
// @access  Private (Student)
const createPaperRequest = async (req, res) => {
  const { academicId, requestType } = req.body;
  try {
    const request = await PaperRequest.create({
      student: req.user._id,
      academicId,
      requestType,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle Like
// @route   POST /api/academic-content/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const content = await AcademicContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const index = content.likes.indexOf(req.user._id);
    if (index === -1) {
      content.likes.push(req.user._id);
    } else {
      content.likes.splice(index, 1);
    }

    await content.save();
    res.json({ likes: content.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/academic-content/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const content = await AcademicContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const newComment = {
      user: req.user._id,
      text: text,
      createdAt: Date.now()
    };

    content.comments.push(newComment);
    await content.save();
    
    // Populate user to return the new comment with user info
    const populatedContent = await AcademicContent.findById(req.params.id).populate('comments.user', 'name profilePicture');
    
    res.status(201).json(populatedContent.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add/Update a Rating
// @route   POST /api/academic-content/:id/rate
// @access  Private
const rateContent = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const content = await AcademicContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if user already rated
    const existingRatingIndex = content.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing
      content.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new
      content.ratings.push({
        user: req.user._id,
        rating: rating
      });
    }

    await content.save();
    res.status(200).json({ message: "Rating saved", ratings: content.ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track a download
// @route   POST /api/academic-content/download/:id
// @access  Private (Student)
const trackDownload = async (req, res) => {
  try {
    const content = await AcademicContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if already downloaded
    const existing = await Download.findOne({
      student: req.user._id,
      content: req.params.id
    });

    if (!existing) {
      await Download.create({
        student: req.user._id,
        content: req.params.id
      });
      // Increment download count on original content
      content.downloads = (content.downloads || 0) + 1;
      
      if (!content.downloadedBy.includes(req.user._id)) {
        content.downloadedBy.push(req.user._id);
      }
      
      await content.save();
      console.log(`[DOWNLOAD] Student ${req.user._id} saved content ${req.params.id}`);
    }

    res.status(200).json({ message: "Download tracked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my downloads
// @route   GET /api/academic-content/my-downloads
// @access  Private (Student)
const getMyDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({ student: req.user._id })
      .sort({ downloadDate: -1 })
      .populate({
        path: 'content',
        populate: { path: 'mentor', select: 'name' }
      });
    res.json(downloads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a personal download
// @route   DELETE /api/academic-content/download/:id
// @access  Private (Student)
const removePersonalDownload = async (req, res) => {
  try {
    const download = await Download.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!download) {
      return res.status(404).json({ message: "Download record not found" });
    }

    await Download.findByIdAndDelete(req.params.id);
    res.json({ message: "Personal download record removed. Original content remains." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics for a mentor
// @route   GET /api/academic-content/mentor-analytics
// @access  Private (Mentor)
const getMentorAnalytics = async (req, res) => {
  try {
    const mentorId = new mongoose.Types.ObjectId(req.user._id.toString());

    // Fetch all active content for this mentor
    const contents = await AcademicContent.find({
      mentor: mentorId,
      status: { $ne: 'deleted' }
    }).sort({ createdAt: -1 });

    // Calculate aggregate stats with aggregation
    const stats = await AcademicContent.aggregate([
      { $match: { mentor: mentorId, status: { $ne: 'deleted' } } },
      {
        $group: {
          _id: null,
          totalUploads: { $sum: 1 },
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDownloads: { $sum: { $ifNull: ["$downloads", 0] } },
          totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
          totalViews: { $sum: { $ifNull: ["$views", 0] } },
          totalRatingsSum: { 
            $sum: { 
              $reduce: {
                input: { $ifNull: ["$ratings", []] },
                initialValue: 0,
                in: { $add: ["$$value", "$$this.rating"] }
              }
            }
          },
          totalRatingsCount: { $sum: { $size: { $ifNull: ["$ratings", []] } } }
        }
      }
    ]);

    const aggregated = stats[0] || {
      totalUploads: 0,
      totalLikes: 0,
      totalDownloads: 0,
      totalComments: 0,
      totalViews: 0,
      totalRatingsSum: 0,
      totalRatingsCount: 0
    };

    const avgRatingGlobal = aggregated.totalRatingsCount > 0 
      ? (aggregated.totalRatingsSum / aggregated.totalRatingsCount).toFixed(1) 
      : 0;

    const totalVideos = contents.filter(c => c.contentType === 'video').length;
    const totalDocuments = contents.filter(c => ['notes', 'ppt', 'paper'].includes(c.contentType)).length;

    // Content type breakdown for pie chart
    const contentTypeBreakdown = {};
    contents.forEach(c => {
      contentTypeBreakdown[c.contentType] = (contentTypeBreakdown[c.contentType] || 0) + 1;
    });

    // Per-resource details
    const resources = contents.map(c => {
      const avg = c.ratings?.length > 0 
        ? c.ratings.reduce((sum, r) => sum + r.rating, 0) / c.ratings.length 
        : 0;

      return {
        _id: c._id,
        title: c.title,
        contentType: c.contentType,
        views: c.views || 0,
        downloads: c.downloads || 0,
        likes: (c.likes && c.likes.length) || 0,
        comments: (c.comments && c.comments.length) || 0,
        avgRating: avg.toFixed(1),
        ratingCount: (c.ratings && c.ratings.length) || 0,
        createdAt: c.createdAt,
        fileUrl: c.fileUrl || '',
      };
    });

    res.json({
      totalUploads: aggregated.totalUploads,
      totalViews: aggregated.totalViews,
      totalDownloads: aggregated.totalDownloads,
      totalLikes: aggregated.totalLikes,
      totalComments: aggregated.totalComments,
      avgRatingGlobal,
      totalVideos,
      totalDocuments,
      contentTypeBreakdown,
      resources,
    });
  } catch (error) {
    console.error('Mentor analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadContent,
  getContentBySubject,
  searchContent,
  createPaperRequest,
  deleteContent,
  trackDownload,
  getMyDownloads,
  removePersonalDownload,
  getMentorAnalytics,
  toggleLike,
  addComment,
  rateContent
};
