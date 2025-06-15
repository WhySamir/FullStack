import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAcessToken,
  changeCurrentpassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  checkSession,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { googleLogin } from "../controllers/auth.controller.js";
const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/google/login").get(googleLogin);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/check-session").get(checkSession);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/change-password").post(verifyJWT, changeCurrentpassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
//taking from params so
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
