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
import claimReward from "./middlewares/reward/claim-reward.js";
import getClaimedRewards from "./middlewares/reward/get-claimed-rewards.js";

const userRoutes = express.Router();

//JWT is provided in Authorization header

userRoutes.route('/login').get(verifyJwt).post(verifyPassword, makeAndSendJwt)
/* GET REQ
Authorization header: string (Bearer jwt)

GET RES
Success decoded jwt object as json
Error non 200 status

POST REQ
{
  email: email,
  password: string
}
 */

userRoutes.route("/signup/email").post(createNewUser);
userRoutes.post("/verify-otp", verifyOtp, makeAndSendJwt);
userRoutes.get("/resend-otp", resendOtp)
userRoutes.get("/reset-password-email/:email", genAndSendPasswordResetLink)
userRoutes.route("/reset-password").get(renderPasswordResetPage).post(resetPassword)
userRoutes.get("/password-reset-success",renderPasswordResetSuccess)
userRoutes.post("/claim", verifyAuthStatus, claimPoints)
userRoutes.get("/claimed", verifyAuthStatus, returnAllClaimedCodes)

userRoutes.route("/reward").post(verifyAuthStatus, claimReward)
/* REQ
{
  id: number
}

RES
[
  RewardsClaimedByUsers,
  {
    pointsRemaining: number
  }
]
 */
.get(verifyAuthStatus, getClaimedRewards)
/* 
RES
RewardsClaimedByUsers[]
*/

export default userRoutes;
