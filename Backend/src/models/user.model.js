import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// jwt bearer token anyone who have it can access simmply key

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true, //enable opitimize searchable database
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cdn url
      required: true,
    },
    coverImage: {
      type: String, //cdn url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: function () {
        // Require password only if the user is NOT signing up with Google
        return !this.googleId;
      },
    },
    refreshToken: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

//before saving database pre hook used to encrypt or any  operation
//pre ma callback ()=>{} use nagarne cause this context won't work so use asyncfn
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//custom methods isPasswordCorrect
//bcrypt libary can hash and also can check original pw  not hashed pw or simply compare(bcrypt method)
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullName, //payload:databasedata
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  //for longerspan,not required to login everytime
  return jwt.sign(
    {
      _id: this.id,
      //payload:databasedata
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
