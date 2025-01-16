import { asyncHandler } from "../utlis/asyncHandler.js";
import mongoose from "mongoose";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscriptions.model.js";

//toggle subscribe
//get user subscribers
//get user subscribed channel

// controller to return subscriber list of a channel

const toggleSubscribe = asyncHandler(async (req, res) => {
  //1. get channel going to un/subscribe by login user from params
  const { channelId } = req.params; //channel or user going to be subscribe or unsubcribe

  const subscriberId = req.user._id; //logined user subscriber

  //check channel exist or not
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel (user) not found");
  }
  if (channelId === String(subscriberId)) {
    throw new ApiError(400, "Cannot subscribe to your own channel");
  }

  //check already subscribed or not
  const existingSubscription = await Subscription.findOne({
    subscribers: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    // Unsubscribe (delete the subscription)
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res.status(200).json({
      status: 200,
      message: "Unsubscribed from the channel successfully",
    });
  } else {
    //subscribe
    const subscription = new Subscription({
      subscribers: subscriberId,
      channel: channelId,
    });
    await subscription.save();

    return res
      .status(200)
      .json(
        new ApiResponds(200, subscription, "Subcribed to channel sucessfully.")
      );
  }
});
const getChannelSubscribers = asyncHandler(async (req, res) => {
  //get all channelid subscribed to user(mero  subscribers)

  const { channelId } = req.params;
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel doesn't exists");
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscribers",
    "fullName email username avatar coverImage" // Populate specific fields of the subscriber
  );
  console.log(subscribers.length);
  return res
    .status(200)
    .json(
      new ApiResponds(
        200,
        subscribers,
        subscribers.length > 0
          ? "Subscribers fetched successfully"
          : "No subscribers found for this channel"
      )
    );
});
//controller to return  channels that i subscribed (maile follow gareko)
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(401, "subscriberid missing");
  }
  const subscriber = await Subscription.find({
    subscribers: subscriberId,
  }).populate(
    "subscribers",
    "fullName email username avatar coverImage" // Populate specific fields of the subscriber
  );

  return res
    .status(200)
    .json(
      new ApiResponds(
        200,
        subscriber,
        subscriber.length > 0 ? "Subscribed channels" : "No channels subscribed"
      )
    );
});
export { toggleSubscribe, getChannelSubscribers, getSubscribedChannels };
