import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["like", "dislike"], // Distinguish between like and dislike
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "contentType", // Dynamic reference (Video, Comment, or Tweet)
    },
    contentType: {
      type: String,
      required: true,
      enum: ["Video", "Comment", "Tweet"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Likes = mongoose.model("Like", likeSchema);
