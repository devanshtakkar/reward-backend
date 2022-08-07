import { prisma } from "../../../index.js";

async function verifyOtp(req, res, next) {
	if (!("email" in req.body)) res.status(400).send("No email in the request");
	if (!("otp" in req.body)) res.status(400).send("No OTP provided in request");
	let email = req.body.email;
	let otp = req.body.otp;
	try {
		let otpInDB = await prisma.OTP.findUnique({
			where: {
				email: email,
			},
		});
		if (otpInDB) {
			if (`${otp}` === otpInDB.OTP) {
				let updateEmailVerificationInDB = await prisma.user.update({
					where: {
						email: email,
					},
					data: {
						emailVerified: true,
					},
				});
				req.userData = updateEmailVerificationInDB
				//send JWT token if the otp is correct and login the user
				next();
			} else {
				res.status(401).send("Incorrect OTP");
			}
		} else {
			res
				.status(403)
				.send(
					"No OTP with this email exists in database. Reason: either your email is already verified or you might need to resend the OTP"
				);
		}
	} catch (err) {
		console.log(err);
	}
}

export { verifyOtp };
