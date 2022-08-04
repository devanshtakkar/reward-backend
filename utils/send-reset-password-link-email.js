import transporter from "./email-transporter.js";
function sendPasswordResetEmail(email, url) {
	return new Promise((resolve, reject) => {
		transporter.sendMail({
			from: "devanshtakkar@ezeeroll.in",
			to: `${email}`,
			subject: "Reset account password",
			text: url.href,
		},(error, info) => {
            if(error){
                reject("Failed to send email")
            }else{
                resolve("Email Sent")
            }
        });
	});
}

export { sendPasswordResetEmail };
