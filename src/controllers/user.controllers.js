import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utlis/cloudinary.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //signup
  //1 get  user data through frontend
  //2validation -not empty
  //3check if user already exists:email,username
  //4check all images,avatar
  //5upload to cloudinary
  //6create user object - create entry in db
  //7remove password and refresh token feild from response
  //8check for user creation return res

  //allrequiredtruemodelsschema
  //1
  const { username, email, fullName, password } = req.body; //not avatar cause we have multer which gives req.files
  // console.log(username, email, fullName);
  //2
  if (
    [username, email, fullName, password].some(
      (feild) => feild?.trim("") === ""
    )
  ) {
    throw new ApiError(400, "All feild are required");
  }
  //3
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username exists already.");
  }
  // console.log(existedUser)
  //4
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) && // Ensure it is an array
    req.files.coverImage.length > 0 // Ensure the array is not empty
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  console.log(req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please Upload Avatar Image");
  }
  //5
  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please Upload Avatar Image on cloud");
  }
  //6
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //7
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went internally wrong while registering User."
    );
  }
  //8
  return res
    .status(201)
    .json(new ApiResponds(200, createdUser, "User registered Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //frontend bata data req.body ->data
  //email or username login
  //find user
  //validate password
  //access and refersh token
  //send to cookie

  const { email, username, password } = req.body;
  // console.log(req.body);

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required ");
  }

  const findUser = await User.findOne({ $or: [{ email }, { username }] });

  if (!findUser) {
    throw new ApiError(404, "User  doesn't exists.");
  }
  const isPasswordValid = await findUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    findUser._id
  );
  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true, //not modifable through frontend only through server
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponds(
        200,
        { user: loggedInUser, accessToken, refreshToken },

        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponds(200, {}, "User logged Out"));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  const incomingRefereshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefereshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefereshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const findUser = await User.findById(decodedToken?._id);
    if (!findUser) {
      throw new ApiError(401, "Invalid referesh token");
    }
    if (incomingRefereshToken !== findUser?.refreshToken) {
      throw new ApiError(401, "Expired referesh token or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshToken(findUser._id);
    return res
      .status(200)
      .cookie("accessToken", newaccessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponds(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access Token Refreshed "
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid referesh token");
  }
});

const changeCurrentpassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: False });
  return res
    .status(200)
    .json(new ApiResponds(200, {}, "Password changed successfully"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponds(200, req.user, "Current user fetched successfully"));
});
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !fullName) {
    throw new ApiError(401, "Email or FullName is required. ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName: fullName, email: email } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponds(200, user, "User details updated successfully"));
}); //files update through multer  who is loggedin

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar not found");
  }

  const avatar = await uploadonCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(400, "Error while not uploading avatar");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } }, //only one so set or also more than two
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponds(200, user, "Avatar Updated Sucessfully"));
});
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage not found");
  }

  const coverImage = await uploadonCloudinary(coverImageLocalPath);
  if (!coverImage.url)
    throw new ApiError(400, "Error while not uploading Cover Image");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } }, //only one so set or also more than two
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponds(200, user, "CoverImage Updated Sucessfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params; //url

  if (!username?.trim()) {
    throw new ApiError(401, "Username not found");
  }
  // User.find({ username });
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        ///total no of subscribers
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      //total no subsribed channels
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribers",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        // users value +additionalinfo
        subcribersCount: {
          $size: "$subscribers",
        },
        channelsSubsribedCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, //in for array&obj
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1, //flag 1true
        username: 1,
        subcribersCount: 1,
        channelsSubsribedCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel doesn't exists");
  }
  return res
    .status(200)
    .json(new ApiResponds(200, channel[0], "User channel fetched sucessfully"));
});
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id), //aggretion pipeline directly to db so created mongoseobjId
      },
    },
    {
      $lookup: {
        from: "videos ",
        localField: "watchHistory",
        foreignField: "_id",
        as: "WatchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponds(
        200,
        user[0].watchHistory,
        "Watch History fetched sucessfully"
      )
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changeCurrentpassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
