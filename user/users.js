import express from "express";
import "dotenv/config";
import { createNewUser } from "./middlewares/auth/createNewuser.js";
import { verifyOtp } from "./middlewares/auth/verify-opt.js";
import { resendOtp } from "./middlewares/auth/resend-otp.js";

const userRoutes = express.Router();

// userRoutes.route('/login').get(verifyJwt).post(verifyPassword)

userRoutes.route("/signup/email").post(createNewUser);
userRoutes.post("/verify-otp", verifyOtp);
userRoutes.get("/resend-otp", resendOtp)
export default userRoutes;
