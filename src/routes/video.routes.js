import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  publishaVideo,
} from "../controllers/video.controller.js";
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  //   .get(getAllVideos)
  .route("/getallvideos")
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

export default router;
