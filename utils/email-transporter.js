import { createTransport } from "nodemailer";

let transporter = createTransport({
	host: "mail.ezeeroll.in",
	port: 465,
	secure: true,
	auth: {
		user: "devanshtakkar@ezeeroll.in",
		pass: "CX#Hm#7Bqd%f@",
	},
});

export default transporter