import express from "express";
import "dotenv/config";
import { createCodes, deleteCodes, getCodes } from "./codes.js";

const adminRoutes = express.Router();

adminRoutes.use((req, res, next) => {
	if (req.admin || req.path === "/login") {
    // if(true){
		next();
	} else {
		res
			.status(401)
			.json({ error: "Not authorized as admin to perform the actions" });
	}
});

adminRoutes
	.route("/login")
	.get((req, res, next) => {
		console.log(req.sessionID)
		if (req.session.admin) {
			res.json({ login: true });
		} else {
			res.json({ login: false});
		}
	})
	.post((req, res, next) => {
		if (req.body.password === process.env.ADMIN_PASSWORD) {
			console.log(req.sessionID)
			req.session.admin = true;
			res.json({ login: true });
		} else {
			res.json({
				login: false,
				error: "Incorrect password",
			});
		}
	});

adminRoutes.route("/codes").post(createCodes).delete(deleteCodes).get(getCodes)

export { adminRoutes };
