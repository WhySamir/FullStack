import { handleGoogleAuth } from "../utlis/googleAuthHelper.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";

const frontendURL = process.env.CLIENT_URL;
// || "http://localhost:5173";

export const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${frontendURL}/signin`);
    }

    const { user, accessToken, refreshToken } = await handleGoogleAuth(code);

    const userWithCounts = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: "subscriptions",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$channel", "$$userId"] } } },
            { $count: "subscribers" },
          ],
          as: "subscribersCount",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $ifNull: [
              { $arrayElemAt: ["$subscribersCount.subscribers", 0] },
              0,
            ],
          },
        },
      },
      {
        $project: {
          password: 0,
          refreshToken: 0,
          __v: 0,
        },
      },
    ]);

    if (!userWithCounts.length) {
      throw new ApiError(
        500,
        "Failed to fetch user details after Google login"
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .redirect(frontendURL);
  } catch (error) {
    console.error("Google login failed:", error);
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Login failed",
    });
  }
};
