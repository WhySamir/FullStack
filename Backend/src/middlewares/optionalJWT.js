import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware that does not throw error on missing/invalid token
export const optionalJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Invalid token: don't assign req.user
    req.user = null;
  } finally {
    next();
  }
};
