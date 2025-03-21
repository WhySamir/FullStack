import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleLikeDislike,
} from "../controllers/likes.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/like-dislike/:contentId/:type").post(toggleLikeDislike);

// router.route("/togglevideolike/u/:videoId").post(toggleVideoLike);
// router.route("/togglecommentslike/u/:commentId").post(toggleCommentsLike);
// router.route("/toggletweetLike/u/:tweetId").post(toggleTweetLike);
router.route("/getlikedvideos").get(getLikedVideos);
export default router;
