import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const uploadMedia = catchAsync(async (req, res, next) => {
    let file = req.file;
    if (!file && req.files) {
      if (req.files.file && req.files.file.length > 0) file = req.files.file[0];
      else if (req.files.image && req.files.image.length > 0) file = req.files.image[0];
    }

    if (!file) {
      return next(new AppError('No file uploaded.', 400));
    }

    // Determine folder from request body, default to packages
    const folderName = req.body.folder || 'packages';

    // Upload directly from memory stream to Cloudinary
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {
            folder: folderName,
            resource_type: 'auto',
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
});

export const deleteMedia = catchAsync(async (req, res, next) => {
    const { public_id, url } = req.body;
    let targetPublicId = public_id;

    if (!targetPublicId && url) {
      // Try to extract public_id from Cloudinary URL if not explicitly provided
      // URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/v<version>/<folder>/<filename>.<ext>
      const urlParts = url.split('/');
      const filenameWithExt = urlParts.pop();
      const folderPath = urlParts.slice(urlParts.indexOf('upload') + 2).join('/'); // Skip 'upload' and 'v<version>'
      const filename = filenameWithExt.split('.')[0];
      targetPublicId = folderPath ? `${folderPath}/${filename}` : filename;
    }

    if (!targetPublicId) {
      return next(new AppError('Public ID or URL is required for deletion.', 400));
    }

    // Since we use auto for upload, we might need to specify resource_type for deletion
    // but Cloudinary sometimes figures it out, or we can try image first then video if it fails.
    // For safety, we can just let Cloudinary delete it without specifying if possible, or default to image.
    // Let's pass resource_type: 'image' and if not found, 'video'
    let result = await cloudinary.uploader.destroy(targetPublicId, { resource_type: 'image' });
    if (result.result === 'not found') {
      result = await cloudinary.uploader.destroy(targetPublicId, { resource_type: 'video' });
    }

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
      result
    });
});
