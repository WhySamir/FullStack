import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

// importing approach
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running at Port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MONGODB!!", error);
  });

/* easier approach suitable for small projects and connecting express and db



// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`Listening at PORT ${process.env.PORT} `);
    });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
})(); //IIFE
*/
