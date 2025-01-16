import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscriptions.model.js";

//get user subscribers
//get user channels subscribed
//toggle subscribe

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  //get all channelid subscribed to user(mero  subscribers)

  const { channelId } = req.params;
});
const getUserSubscribedChannels = asyncHandler(async (req, res) => {
  //get  channels that i subscribed (maile follow gareko)
  const { subscriberId } = req.params;
});
export { getUserChannelSubscribers, getUserSubscribedChannels };
