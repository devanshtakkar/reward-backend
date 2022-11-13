import { prisma } from "../../../index.js";
import Joi from "joi";
import sendWhatsAppTemplateMessage from "../../../utils/WA-template-send.js"

async function sendOtpOnWhatsApp(req, res, next) {
	let body = req.body;
	let joiObject = Joi.object({
		number: Joi.string()
			.regex(/^[0-9]{10}$/, { name: "Phone Number" })
			.required(),
		countryCode: Joi.number().min(1).max(1000).required(),
	});
	try {
		let verifiedJoiData = await joiObject.validateAsync(body);
    let receiversPhoneNumber = `${verifiedJoiData.countryCode}${verifiedJoiData.number}`;

		//check whether the number already exists in database or not
		let numberInDB = await prisma.whatsAppNumbers.findFirst({
			where: {
				AND: [
					{
						number: {
              equals: BigInt(verifiedJoiData.number)
            }
					},
					{
						countryCode: verifiedJoiData.countryCode,
					},
				],
			},
			include: {
				user: true,
			},
		});

		//return error if the user with this phone number already exists
		if (numberInDB?.user) {
			res.status(400).send("A user with this phone number already exists");
			return;
		}

		//generate the otp
		let otp = 0;
		do {
			otp = Math.floor(Math.random() * 1000000);
		} while (otp <= 100000);

		//save the OTP in database
		let newOtpInDB = await prisma.oTP.upsert({
			where: {
				whatsAppNumber: BigInt(
					`${verifiedJoiData.countryCode}${verifiedJoiData.number}`
				),
			},
			update: {
				OTP: otp,
				expiresAt: Date.now() + 600000,
				retries: {
					increment: 1,
				},
			},
			create: {
				OTP: otp,
				whatsAppNumber: BigInt(
					`${verifiedJoiData.countryCode}${verifiedJoiData.number}`
				),
				expiresAt: Date.now() + 600000,
			},
		});

		//return the error if the maximum retries are exceeded
    if(newOtpInDB.retries > 5){
      res.status(429).send("Too many retries. Please try again after 20 minutes");
      return
    }

    //send the otp on whatsapp
    let responseJson = await sendWhatsAppTemplateMessage(receiversPhoneNumber, "verification_otp", [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: `${otp}`
          }
        ]
      }
    ])
    if(!responseJson.error){
			res.json({
				sent: true
			})
			return
		}else{
			res.json({
				sent: false
			})
			return
		}
	} catch (error) {
		console.log(`${new Date()}: ${error.stack}`);
		if (error.name === "ValidationError") {
			res.status(400).send(error.message);
			return;
		}
		if (error.code) {
			res.status(500).send("A database error has occured");
			return;
		}
    if(error.name === "WA_Message_Error"){
      res.status(500).send(error.message)
      return
    }
		res.status(500).send("Internal server error has occured");
	}
}

export default sendOtpOnWhatsApp;
