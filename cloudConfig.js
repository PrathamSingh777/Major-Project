const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary credentials
const config = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
};

cloudinary.config(config);
cloudinary.v2.config(config);

// Guard: multer-storage-cloudinary expects .v2.uploader whether top-level or v2 is passed
cloudinary.v2.v2 = cloudinary.v2;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust",
        allowed_formats: ["jpeg", "jpg", "png", "webp"],
    }
});

module.exports = {
    cloudinary,
    storage
};
