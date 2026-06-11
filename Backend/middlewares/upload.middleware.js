import multer from 'multer';

// Use memory storage to avoid saving files locally
const storage = multer.memoryStorage();

// File validation
const fileFilter = (req, file, cb) => {
  // Accept specific image and video formats
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPG, PNG, WEBP, MP4, and WEBM are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos and images
  },
  fileFilter: fileFilter
});

export default upload;
