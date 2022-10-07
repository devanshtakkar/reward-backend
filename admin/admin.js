import express from "express";
import "dotenv/config";
import getLoginStatus from "./middlewares/auth/get-login-status.js";
import login from "./middlewares/auth/login.js";
import { createCodes, deleteCodes, getCodes } from "./middlewares/codes.js";
import verifyJwt from "./middlewares/auth/verify-jwt.js";
const adminRoutes = express.Router();

//authentication Routes

adminRoutes.post("/get-login-status", getLoginStatus);
// REQ
// {
// 	jwt: string
// }
// RES
// {
// 	login: boolean
// }

adminRoutes.post("/login", login);

// REQ
// {
//     password: string
// }

// RES
// {
//     jwt: JWT
// }

//Codes routes
adminRoutes
	.route("/codes")
	.post(verifyJwt, createCodes)
    // REQ
    // {
    //     jwt: string,
    //     codes: [
    //         {
    //             points: number
    //             code: string
    //             createTime: time
    //         }
    //     ]
    // }

    // RES
    // codes[]
	.get(verifyJwt, getCodes);
adminRoutes.delete("/delete-codes", verifyJwt, deleteCodes);

export default adminRoutes;
