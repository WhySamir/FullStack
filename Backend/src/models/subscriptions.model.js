import mongoose from "mongoose";
//mongodb so everytime new document created when subscribe to got subscribe
const subscriptionSchema = new mongoose.Schema(
  {
    subscribers: {
      //no of particular channels in a document or simply total no of channels for a user
      type: mongoose.Schema.Types.ObjectId, // one who is subscribing
      ref: "User",
    },
    channel: {
      //find total channels that i subscribed->subandch
      type: mongoose.Schema.Types.ObjectId, // The user (or "channel") being subscribed to.
      ref: "User",
    },
  },
  { timestamp: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
