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

async function sendOtpEmail(to, name = `user`, otp) {
	sendEmail(to, name, otp)
}

function sendEmail(to, name, otp) {
	transporter.sendMail(
		{
			from: "devanshtakkar@ezeeroll.in>", // sender address
			to: `${to}`, // list of receivers
			subject: `Verify your email`,
			text: emailText(name, otp)
		},
		(err, info) => {
			console.log(err, info);
		}
	);
}

function emailText(name, otp){
	return (
`Hello ${name} from Ezeeroll Castors!

You're receiving this e-mail because ${name} has given your e-mail address to register an account on ezeeroll.in.

This OTP is only valid for 10 minutes.

To confirm this is correct, Fill your OTP: ${otp}

Thank you for using Ezeeroll Castors!
ezeeroll.in`
	)
}

export { sendOtpEmail };
