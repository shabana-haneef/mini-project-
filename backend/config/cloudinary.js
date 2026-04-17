const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Storage for Club Events (Images mainly)
const eventStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'campus-club-events',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
});

// Storage for Academic Content (Disk first, then manual Cloudinary upload)
const academicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    }
});

// Storage for Profile Pictures
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-profiles',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
    },
});

const upload = multer({ storage: eventStorage });
// Increase limit to 1GB for academic content uploads
const academicUpload = multer({
    storage: academicStorage,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 } // 1GB
});
const profileUpload = multer({ storage: profileStorage });

module.exports = { cloudinary, upload, academicUpload, profileUpload };
