import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChannelSubscribers,
  getSubscribedChannels,
  toggleSubscribe,
} from "../controllers/subscriptions.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/u/:channelId").get(getChannelSubscribers).post(toggleSubscribe);
router.route("/c/:subscriberId").get(getSubscribedChannels);

export default router;
