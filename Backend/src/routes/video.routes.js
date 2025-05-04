import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideosbyid,
  incrementViews,
  publishaVideo,
  togglePublishStatus,
  updateVideodetails,
} from "../controllers/video.controller.js";
import { optionalJWT } from "../middlewares/optionalJWT.js";
const router = Router();

router.route("/getallvideos").get(getAllVideos);

router.route("/publishavideo").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishaVideo
);

router.route("/vid-id/:videoById").get(optionalJWT, getVideosbyid);
router.route("/update-videodetails/:videoById").patch(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateVideodetails
);
router.route("/deletevid/:videoById").delete(verifyJWT, deleteVideo);
router.route("/togglepublish/:videoById").patch(verifyJWT, togglePublishStatus);
router.route("/increaseviews/:videoById").post(incrementViews);

export default router;
