const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

const streamifier = require('streamifier'); // npm install streamifier

dotenv.config(); // Load environment variables from .env file

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
const uploadImage = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ public_id: filename }, (error, result) => {
      if (error) {
        console.error('Error uploading image:', error);
        return reject(error); // Reject the promise if there’s an error
      }
      resolve(result.secure_url); // Resolve with the secure URL of the uploaded image
    });

    // Convert buffer to a readable stream and pipe to uploadStream
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { uploadImage };
