import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import fetch from "node-fetch";
import stream from "stream";
import { promisify } from "util";

// Configuration
const pipeline = promisify(stream.pipeline);

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
      chunk_size: 9000000,
    });
    fs.unlinkSync(localfilepath);
    console.log(uploadResult);
    console.log("file is uploaded to cloudinary", uploadResult.url);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localfilepath); //remmove local saved temp file as upload operation failed
    return null;
  }
};
// New function for URL-based uploads (Google avatars)
const uploadFromUrlToCloudinary = async (imageUrl) => {
  try {
    // Fetch higher resolution image from Google
    const highResUrl = imageUrl.replace("=s96-c", "=s400-c");

    // Fetch image from URL
    const response = await fetch(highResUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);

    // Create write stream to temporary file
    const tempFilePath = `./temp-${Date.now()}.jpg`;
    const writeStream = fs.createWriteStream(tempFilePath);

    // Pipe response body to file
    await pipeline(response.body, writeStream);

    // Upload temp file to Cloudinary
    const uploadResult = await uploadonCloudinary(tempFilePath);

    return uploadResult?.url || imageUrl; // Fallback to original URL
  } catch (error) {
    console.error("URL upload error:", error);
    return imageUrl; // Return original URL as fallback
  }
};

export { uploadonCloudinary, uploadFromUrlToCloudinary };
