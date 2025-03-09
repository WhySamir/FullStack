import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComments,
  deleteComment,
  editUserComment,
  getVideoComments,
  replyToComment,
} from "../controllers/comments.controller.js";
// import { deleteComment } from "../controllers/comments.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/createcomments/u/:videoId").post(createComments);
router.route("/deletecomment/u/:commentId").delete(deleteComment);
router.route("/editusercomment/u/:commentId").patch(editUserComment);
router.route("/getvideocomments/u/:videoId").get(getVideoComments);
router.route("/replycomment/u/:commentId").post(replyToComment);
export default router;
