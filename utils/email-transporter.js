import { createTransport } from "nodemailer";

let transporter = createTransport({
	host: "smtp.yandex.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_ADD,
		pass: process.env.SMTP_PASS,
	},
});

export default transporter