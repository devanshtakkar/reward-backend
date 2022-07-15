import express from "express";
import "dotenv/config";
import { createNewUser } from "./middlewares/auth/createNewuser.js";
import { resendVerificationEmail } from "./middlewares/auth/resendVerificationEmail.js";
import { verifyEmail } from "./middlewares/auth/verifyEmail.js";

const userRoutes = express.Router();

// userRoutes.route('/login').get(verifyJwt).post(verifyPassword)

userRoutes.route("/signup/email").post(createNewUser);
userRoutes.get("/resend-verification-email", resendVerificationEmail);

userRoutes.get("/verify-email",verifyEmail);

export default userRoutes;
