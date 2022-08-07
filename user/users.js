import express from "express";
import "dotenv/config";
import { createNewUser } from "./middlewares/auth/createNewuser.js";
import { verifyOtp } from "./middlewares/auth/verify-otp.js";
import { resendOtp } from "./middlewares/auth/resend-otp.js";
import { makeAndSendJwt } from "./middlewares/auth/generate-and-send-jwt.js";
import {verifyJwt} from "./middlewares/auth/verify-jwt.js";
import { verifyPassword } from "./middlewares/auth/verify-password.js";
import genAndSendPasswordResetLink from "./middlewares/auth/create-reset-password-email.js";
import renderPasswordResetPage from "./middlewares/auth/render-password-reset-page.js";
import resetPassword from "./middlewares/auth/reset-password.js";
import renderPasswordResetSuccess from "./middlewares/auth/render-password-reset-success.js";
import verifyAuthStatus from "./middlewares/auth/verify-auth-status.js";
import claimPoints from "./middlewares/points/claim.js";
import returnAllClaimedCodes from "./middlewares/points/return-all-claimed-codes.js";

const userRoutes = express.Router();

userRoutes.route('/login').get(verifyJwt).post(verifyPassword, makeAndSendJwt)

userRoutes.route("/signup/email").post(createNewUser);
userRoutes.post("/verify-otp", verifyOtp, makeAndSendJwt);
userRoutes.get("/resend-otp", resendOtp)
userRoutes.get("/reset-password-email/:email", genAndSendPasswordResetLink)
userRoutes.route("/reset-password").get(renderPasswordResetPage).post(resetPassword)
userRoutes.get("/password-reset-success",renderPasswordResetSuccess)
userRoutes.post("/claim", verifyAuthStatus, claimPoints)
userRoutes.get("/claimed", verifyAuthStatus, returnAllClaimedCodes)
export default userRoutes;
