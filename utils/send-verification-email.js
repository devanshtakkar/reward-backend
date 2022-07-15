import { createTransport } from "nodemailer";
import { randomBytes } from "node:crypto";
import { prisma } from "../index.js";

let transporter = createTransport({
	host: "mail.ezeeroll.in",
	port: 465,
	secure: true,
	auth: {
		user: "devanshtakkar@ezeeroll.in",
		pass: "CX#Hm#7Bqd%f@",
	},
});

async function sendVerificationEmail(to, name = `user`) {
	try {
		let oldLinkInDB = await prisma.verificationLink.findUnique({
			where: {
				email: to,
			},
		});
		if (oldLinkInDB) {
			if (oldLinkInDB.expiresAt > Date.now()) {
				sendEmail(to, name, oldLinkInDB.link);
			} else {
				/*** update the verification link if the time has exceded the expiry time
				*/
				await prisma.verificationLink.update({
					data:{
						expiresAt: Date.now() + 1000*60*10
					},
					where: {
						email: to
					}
				})
				sendEmail(to, name, oldLinkInDB.link);
			}
		} else {
			let random = randomBytes(100);
			let link = random.toString("base64url");
			//add the verification link if no old link already exists in the database
			await prisma.verificationLink.create({
				data: {
					link: link,
					email: to,
					expiresAt: Date.now() + 1000*60*10
				}
			})
			sendEmail(to, name, link);
		}
	} catch (err) {
		console.log(err);
	}
}

function sendEmail(to, name, link) {
	let url = new URL("http://localhost:3001/user/verify-email");
	url.searchParams.set("email", to);
	url.searchParams.set("link", link);
	console.log(link)
	transporter.sendMail(
		{
			from: "devanshtakkar@ezeeroll.in>", // sender address
			to: `${to}`, // list of receivers
			subject: `Verify your email`,
			text: emailText(name, url)
		},
		(err, info) => {
			console.log(err, info);
		}
	);
}

function emailText(name, link){
	return (
`Hello ${name} from Ezeeroll Castors!

You're receiving this e-mail because user ${name} has given your e-mail address to register an account on ezeeroll.in.

This link is only valid for 10 minutes.

To confirm this is correct, go to ${link}

Thank you for using Ezeeroll Castors!
ezeeroll.in`
	)
}

export { sendVerificationEmail };
