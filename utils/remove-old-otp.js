import {prisma} from "../index.js"
async function OtpAutoExpiry() {
	setInterval(removeOldOtp, 1000 * 60 * 2);
}

async function removeOldOtp() {
	let currentTime = Date.now();
	try {
		let data = await prisma.OTP.deleteMany({
			where: {
				expiresAt: {
					lt: currentTime,
				},
			},
		});
		console.log(data);
	} catch (err) {
		console.log(err);
	}
}

export {OtpAutoExpiry}