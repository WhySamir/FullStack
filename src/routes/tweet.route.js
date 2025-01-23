import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweets,
  deleteTweet,
  editUserTweet,
  getUserTweets,
} from "../controllers/tweets.contoller.js";

// import { deleteComment } from "../controllers/comments.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/createtweets").post(createTweets);
router.route("/deletetweets/u/:tweetId").delete(deleteTweet);
router.route("/editusertweet/u/:tweetId").patch(editUserTweet);
router.route("/getusertweets").get(getUserTweets);
export default router;
