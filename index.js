import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"
import "dotenv/config";
import adminRoutes from "./admin/admin.js";
import userRoutes from "./user/users.js";
import fileUpload from 'express-fileupload';
import OtpAutoExpiry from "./utils/otp-auto-expiry.js";

const app = express();
const prisma = new PrismaClient();

app.use(
	cors({
		origin: ["https://hoppscotch.io", "http://localhost:3001", "https://app.ezeeroll.in"],
		credentials: true,
	})
);


//body parsing middlewares
app.use(express.json());
app.use(express.text());
app.use(fileUpload({
	limits: {
		fileSize: 2000000,
	},
	abortOnLimit: true
}));


//serving static files
app.use(express.static("static"))

//view engine setting
app.set("views", "./views");
app.set("view engine", "pug")

//routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/static", express.static("files"));

// app.use("/test",test)

app.listen(3001, () => {
    console.log("Server started on port 3001")
})

OtpAutoExpiry();
export {prisma}