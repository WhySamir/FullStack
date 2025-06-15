// utils/googleAuthHelper.js
import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { uploadFromUrlToCloudinary } from "./cloudinary.js";

export const handleGoogleAuth = async (code, state) => {
  const redirectUri = "http://localhost:8000/api/v1/users/google/login";

  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const tokens = tokenResponse.data;

  // Get user info
  const userInfo = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );
  const { email, name, picture } = userInfo.data;

  let user = await User.findOne({ email });

  if (!user && state === "signup") {
    let avatarUrl = picture;
    try {
      if (picture) {
        avatarUrl = await uploadFromUrlToCloudinary(picture);
      }
    } catch (error) {
      console.error("Cloudinary upload failed, using Google URL:", error);
    }

    user = await User.create({
      email,
      fullName: name,
      avatar:
        avatarUrl || "https://eu.ui-avatars.com/api/?name=John+Doe&size=250",
      username: email.split("@")[0].toLowerCase(),
      googleId: userInfo.data.id,
    });
  }

  if (!user) {
    return {
      needsSignup: true,
      email,
      name,
      picture,
      googleId: userInfo.data.id,
    };
  }

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken, needsSignup: false };
};
