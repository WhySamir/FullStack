import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; //middleware simply creates obj of cookie

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); //middleware or configuration

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser()); //access  req.cookie

//routes
import userRouter from "./routes/user.routes.js";

//routes declaration .usefor middleware and controller access not provided segmently by app.get as routeris accessed customly
app.use("/api/v1/users", userRouter); //router,controller

export { app };
