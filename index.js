import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"
import "dotenv/config";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { adminRoutes } from "./admin/index.js";
import userRoutes from "./user/users.js";


const app = express();
const prisma = new PrismaClient();

app.use(
	cors({
		origin: ["https://hoppscotch.io", "http://localhost:3000"],
		credentials: true,
	})
);

app.use(
	session({
		name: "Express",
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: false,
		store: new PrismaSessionStore(new PrismaClient(), {
			checkPeriod: 2 * 60 * 1000, //ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
		cookie: {
			maxAge: 604800000
		}
	})
);

app.use(express.json());
app.use(express.text());
app.use("/admin", adminRoutes);
app.use("/user", userRoutes)

app.listen(3001, () => {
    console.log("Server started on port 3001")
})

export {prisma}