import multer from 'multer';

// Use memory storage for Cloudinary integration (or disk storage if you prefer saving locally first)
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

export default upload;
