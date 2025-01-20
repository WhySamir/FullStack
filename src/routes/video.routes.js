import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideosbyid,
  publishaVideo,
  togglePublishStatus,
  updateVideodetails,
} from "../controllers/video.controller.js";
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/getallvideos")
  .get(getAllVideos)
  .post(
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
router.route("/vid-id/:videoById").get(getVideosbyid);
router.route("/update-videodetails/:videoById").patch(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateVideodetails
);
router.route("/deletevid/:videoById").delete(deleteVideo);
router.route("/togglepublish/:videoById").patch(togglePublishStatus);

export default router;
