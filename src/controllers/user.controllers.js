import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utlis/cloudinary.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
const registerUser = asyncHandler(async (req, res) => {
  //signup
  // get  user data through frontend
  //validation -not empty
  //check if user already exists:email,username
  //check all images,avatar
  //upload to cloudinary
  //create user object - create entry in db
  //remove password and refresh token feild from response
  //check for user creation return res

  const { username, email, fullName } = req.body;
  console.log(req.body);
  console.log(username, email, fullName);

  if ([username, email, fullName].some((feild) => feild?.trim("") === "")) {
    throw new ApiError(400, "All feild are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username exists already.");
  }
  // console.log(existedUser)

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please Upload Avatar Image");
  }

  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please Upload Avatar Image");
  }

  const userRef = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(userRef._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went internally wrong while registering User."
    );
  }
  return res.status(
    201,
    json(new ApiResponds(200, createdUser, "User registered Sucessfully"))
  );
});

export { registerUser };
