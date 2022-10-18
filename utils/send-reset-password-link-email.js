import transporter from "./email-transporter.js";
function sendPasswordResetEmail(email, url) {
	return new Promise((resolve, reject) => {
		transporter.sendMail({
			from: process.env.EMAIL_ADD,
			to: `${email}`,
			subject: "Reset account password",
			text: url.href,
		},(error, info) => {
            if(error){
				console.log(error)
                reject("Failed to send email")
            }else{
                resolve("Email Sent")
            }
        });
	});
}

export { sendPasswordResetEmail };
