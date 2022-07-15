import { sendVerificationEmail } from "../../../utils/send-verification-email.js";
import { prisma } from "../../../index.js";


async function resendVerificationEmail(req, res, next) {
	let email = req.query?.email;
	if (email) {
		let userInDB;
		try {
			userInDB = await prisma.user.findFirst({
				where: {
					email: email,
				},
			});
		} catch (error) {
			res.status(500).send("database error");
		}

		if (userInDB) {
			sendVerificationEmail(email);
			res.status(201).json({
				emailVerification: "pending",
			});
		} else {
			res
				.status(404)
				.send(
					"You can not request a email verifiction link before creating an account with us"
				);
		}
	} else {
		res.status(404).send("No email specified in request");
	}
}

export { resendVerificationEmail };
