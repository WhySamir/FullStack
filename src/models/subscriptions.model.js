import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      //no of particular channels in a document
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      //find total channels that i subscribed->subandch
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
