import { prisma } from "../../../index.js";
import Joi from "joi";
import { randomBytes } from "node:crypto";
import { sendPasswordResetEmail } from "../../../utils/send-reset-password-link-email.js";
async function genAndSendPasswordResetLink(req, res, next) {
	let unvalidatedEmail = req.params.email;

	//send the error - no email is provided in request
	if (!unvalidatedEmail)
		res.status(400).send("No email provided to generate reset link for.");
	let validateEmailObj = Joi.string().email();
	try {
		let validatedEmail = await validateEmailObj.validateAsync(unvalidatedEmail);
		let userInDB = await prisma.user.findFirst({
			where: {
				email: validatedEmail,
			},
		});

		//if the user is valid then generate a random token using the crypto module and send the email
		if (userInDB == null) {
			res.status(400).send("No user with this email address exists.");
		} else {
			randomBytes(100, (error, buffer) => {
				if (error) {
					res.status(500).send("Internal Server Error");
				} else {
					//create the link path, store it to database and send it
					let linkPath = buffer.toString("base64url");
					let url = new URL("/reset-password", "http://localhost:3001");
					url.searchParams.append("email", validatedEmail);
					url.searchParams.append("token", linkPath);

					//Promise all condition that send a successful response back only when the an email is sent and the link is stored or updated in database

					Promise.all([
						//function that return a promise to send the password reset email
						sendPasswordResetEmail(validatedEmail, url),
						//promise that stores the link into database
						new Promise(async (resolve, reject) => {
							try{
								let newResetLinkInDB = await prisma.passwordResetLink.upsert({
									where: {
										email: validatedEmail,
									},
									create: {
										email: validatedEmail,
										token: linkPath,
										expiresAt: Date.now() + 1000 * 60 * 60 * 24,
									},
									update: {
										token: linkPath,
										expiresAt: Date.now() + 1000 * 60 * 60 * 24,
									},
								})

								resolve(newResetLinkInDB)
		
							}catch(error){
								console.log(error)
								reject("Internal Database Error while generating the password reset link")
							}
						})
					])
						.then((resolve, reject) => {
							res
								.status(201)
								.json({ email: validatedEmail, status: "success" });
						})
						.catch((error) => {
                            console.log(error)
							res.status(500).send(error);
						});
				}
			});
		}
	} catch (error) {
		console.log(error);
		if (error.name === "ValidationError") {
			res.status(400).send("Not a valid email Address");
		} else if (error.code) {
			res.status(500).send("Internal Database Error");
		} else {
			res.status(500).send("Internal Server Error");
		}
	}
}

export default genAndSendPasswordResetLink;
