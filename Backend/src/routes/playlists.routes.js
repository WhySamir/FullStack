import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlists.controller.js";
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/createplaylist").post(createPlaylist);
router.route("/getuserplaylists").get(getUserPlaylists);
router.route("/u/:playlistId").get(getPlaylistById);
router.route("/p/playlist/:playlistId/video/:videoId").post(addVideoToPlaylist);
router
  .route("/r/playlist/:playlistId/video/:videoId")
  .delete(removeVideoFromPlaylist);
router.route("/d/:playlistId").delete(deletePlaylist);
router.route("/updateplaylist/u/:playlistId").patch(updatePlaylist);
export default router;
