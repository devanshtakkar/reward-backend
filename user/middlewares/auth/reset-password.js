import { prisma } from "../../../index.js";
import { hashPassword } from "../../../utils/hash.js";
import Joi from "joi";
import "dotenv/config";

async function resetPassword(req, res, next) {
	let email = req.query.email;
	let token = req.query.token;
	let passwordVerifyObj = Joi.string().min(8).max(20).required();
	let newPassword = req.body.password;
	if (email && token) {
		try {
			let verifiedPass = await passwordVerifyObj.validateAsync(newPassword);
			let resetUrlInDB = await prisma.passwordResetLink.findFirst({
				where: {
					email: email,
				},
			});
			if (resetUrlInDB.expiresAt < Date.now()) {
				res.status(401).send("Password reset link has expired");
			} else {
				if (resetUrlInDB.token === token) {
					let newHash = await hashPassword(verifiedPass);
					prisma
						.$transaction([
							prisma.user.update({
								where: {
									email: email,
								},
								data: {
									passwordHash: newHash,
								},
							}),
							prisma.passwordResetLink.delete({
								where: {
									email: email
								}
							})
						])
						.then((resolve, reject) => {
							res.json({
								status: "success",
								email: email,
								forward: `${process.env.BASE_URL}/user/password-reset-success`,
							});
						})
						.catch((error) => {
							console.log(error);
							res.status(500).send("Internal server error.");
						});
				} else {
				}
			}
		} catch (error) {
			console.log(error);
			if (error.name === "ValidationError") {
				res.status(400).send(error.message);
			} else {
				res.status(500).send("Internal server error. Try again later");
			}
		}
	} else {
		res.status(400).send("Invalid request");
	}
}

export default resetPassword;
