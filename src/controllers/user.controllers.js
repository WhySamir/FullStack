import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utlis/cloudinary.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
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

  //allrequirdtrur
  //1
  const { username, email, fullName, password } = req.body; //not avatar cause we have multer which gives req.files
  console.log(req.body);
  console.log(username, email, fullName);
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

export { registerUser };
