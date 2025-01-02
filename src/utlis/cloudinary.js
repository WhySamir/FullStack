import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

const uploadonCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    //return file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file is uploaded to cloudinary", uploadResult.url);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localfilepath); //remmove local saved temp file as upload operation failed
    return null;
  }
};

export { uploadonCloudinary };
