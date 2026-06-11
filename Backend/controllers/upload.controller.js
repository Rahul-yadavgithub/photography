import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadMedia = async (req, res) => {
  try {
    let file = req.file;
    if (!file && req.files) {
      if (req.files.file && req.files.file.length > 0) file = req.files.file[0];
      else if (req.files.image && req.files.image.length > 0) file = req.files.image[0];
    }

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
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
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, message: 'Media upload failed.', error: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
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
      return res.status(400).json({ success: false, message: 'Public ID or URL is required for deletion.' });
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
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ success: false, message: 'Media deletion failed.', error: error.message });
  }
};
