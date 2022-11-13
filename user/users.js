import express from "express";
import "dotenv/config";
import { createNewUser } from "./middlewares/auth/createNewuser.js";
import { verifyOtp } from "./middlewares/auth/verify-otp.js";
import { resendOtp } from "./middlewares/auth/resend-otp.js";
import { makeAndSendJwt } from "./middlewares/auth/generate-and-send-jwt.js";
import { verifyJwt } from "./middlewares/auth/verify-jwt.js";
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
import createNewUserAuthByWhatsapp from "./middlewares/auth/create-new-whatsapp-user.js";
import getUserDetails from "./middlewares/user-details/get-user-details.js";
import updateUserDetails from "./middlewares/user-details/update-user-details.js";
import verifyWhatsAppNumber from "./middlewares/auth/verify-whatsapp-number.js";

const userRoutes = express.Router();

//JWT is provided in Authorization header

userRoutes.route("/login").get(verifyJwt).post(verifyPassword, makeAndSendJwt);
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

userRoutes.route("/signup/email").post(createNewUser, makeAndSendJwt);
/* 
REQ
{
  firstName: string,
  lastName: string?,
  occupation: string,
  email: Email,
  password: string
}
RES
{
  jwt: jwt
}
*/
userRoutes.post("/send-whatsapp-otp", verifyWhatsAppNumber);
/* 
REQ
{
  number: BigInt,
  countryCode: countryCode
}

RES
{
  sent: Boolean
}
*/
userRoutes
	.route("signup/whatsapp")
	.post(createNewUserAuthByWhatsapp, makeAndSendJwt);
/* 
REQ
{
  firstName: string,
  lastName: string?,
  countryCode: Int,
  whatsApp: string,
  occupation: string,
}
RES
{
  jwt: jwt
}
*/
userRoutes
	.route("/")
	.get(verifyAuthStatus, getUserDetails)
	.patch(verifyAuthStatus, updateUserDetails);
/* 
PATCH REQ
{
  id: number().min(1).max(1000000)
  firstName: string,
  lastName: string,
  occupation: string,
  email: Email,

}
*/
userRoutes.post("/verify-email-otp", verifyOtp, makeAndSendJwt);
userRoutes.get("/resend-email-otp", resendOtp);
userRoutes.get("/reset-password-email/:email", genAndSendPasswordResetLink);
userRoutes
	.route("/reset-password")
	.get(renderPasswordResetPage)
	.post(resetPassword);
userRoutes.get("/password-reset-success", renderPasswordResetSuccess);
userRoutes.post("/claim", verifyAuthStatus, claimPoints);
userRoutes.get("/claimed", verifyAuthStatus, returnAllClaimedCodes);

userRoutes
	.route("/reward")
	.post(verifyAuthStatus, claimReward)
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
	.get(verifyAuthStatus, getClaimedRewards);
/* 
RES
RewardsClaimedByUsers[]
*/

export default userRoutes;
