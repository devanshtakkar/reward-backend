import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"
import "dotenv/config";
import adminRoutes from "./admin/admin.js";
import userRoutes from "./user/users.js";
import { OtpAutoExpiry } from "./utils/remove-old-otp.js";


const app = express();
const prisma = new PrismaClient();

app.use(
	cors({
		origin: ["https://hoppscotch.io", "http://localhost:3001", "https://app.ezeeroll.in"],
		credentials: true,
	})
);


OtpAutoExpiry()

//body parsing middlewares
app.use(express.json());
app.use(express.text());

//serving static files
app.use(express.static("static"))

//view engine setting
app.set("views", "./views");
app.set("view engine", "pug")

//routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes)

app.listen(3001, () => {
    console.log("Server started on port 3001")
})

export {prisma}