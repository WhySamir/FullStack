import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utlis/cloudinary.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";

//videoupload,delete
//getVideosbyid
//getallVideos
//publishaVid  get video, upload to cloudinary, create video
//togglePublishStatus
