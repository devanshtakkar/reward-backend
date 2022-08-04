import express from "express";
import "dotenv/config";
import { createNewUser } from "./middlewares/auth/createNewuser.js";
import { verifyOtp } from "./middlewares/auth/verify-opt.js";
import { resendOtp } from "./middlewares/auth/resend-otp.js";
import { makeAndSendJwt } from "./middlewares/auth/generate-and-send-jwt.js";
import {verifyJwt} from "./middlewares/auth/verify-jwt.js";
import { verifyPassword } from "./middlewares/auth/verify-password.js";
import genAndSendPasswordResetLink from "./middlewares/auth/create-reset-password-email.js";

const userRoutes = express.Router();

userRoutes.route('/login').get(verifyJwt).post(verifyPassword, makeAndSendJwt)

userRoutes.route("/signup/email").post(createNewUser);
userRoutes.post("/verify-otp", verifyOtp, makeAndSendJwt);
userRoutes.get("/resend-otp", resendOtp)
userRoutes.get("/reset-password-email/:email", genAndSendPasswordResetLink)
export default userRoutes;
