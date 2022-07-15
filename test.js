
let transporter = createTransport({
	host: "mail.ezeeroll.in",
	port: 465,
	secure: true,
	auth: {
		user: "devanshtakkar@ezeeroll.in",
		pass: "CX#Hm#7Bqd%f@",
	},
});

function sendEmail(to, name, link) {
	let url = new URL("http://localhost:3001");
	url.searchParams.set("email", to);
	url.searchParams.set("link", link);
	transporter.sendMail(
		{
			from: "devanshtakkar@ezeeroll.in>", // sender address
			to: `${to}`, // list of receivers
			subject: `Verify your email`,
			text: url,
		},
		(err, info) => {
			console.log(err, info);
		}
	);
}