import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

//auth middleware for logging out through accessToken
export const verifyJWT = asyncHandler(async (req, _, next) => {
  //access token
  try {
    const token =
      req.cookies?.accessToken || //? for mobile application and or for user sending customer header
      req.header("Authorization")?.replace("Bearer ", ""); //jwt intro
    //Authorization:Bearer token so replaced Authorizaiton:token

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken "
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next(); //for another processing ie. logoutUser in user.route
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
