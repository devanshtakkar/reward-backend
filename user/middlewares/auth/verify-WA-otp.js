import { prisma } from "../../../index.js";
import Joi from "joi";

async function verifyWhatsAppOtp(req, res, next) {
	let body = req.body;
	let JoiObject = Joi.object({
		number: Joi.string().regex(/^[0-9]{11,13}$/, { name: "Phone Number" }),
		otp: Joi.number().min(100000).max(999999).required(),
	});
	try {
		let verifiedData = await JoiObject.validateAsync(body);
		let phoneNumber = BigInt(verifiedData.number);
		let otpInDB = await prisma.oTP.findFirst({
			where: {
				whatsAppNumber: phoneNumber,
			},
		});
		/* 
    Check whether the number for which the OTP requested is associated with any
    user or not. In case no previous user is associated redirect the user to enter 
    details. The response returned in this case is without jwt. If the user already
    exists for this number then return the jwt by calling the NEXT method.
    */
   console.log(otpInDB?.OTP , verifiedData.otp)
		if (otpInDB?.OTP == verifiedData.otp) {
			let WAnumberDetailsInDB = await prisma.whatsAppNumbers.findFirst({
				where: {
					AND: [
						{
							number: BigInt(String(phoneNumber).slice(-10)),
						},
						{
							countryCode: Number(String(phoneNumber).slice(0, -10)),
						},
					],
				},
        include: {
          user: true
        }
			});
			if(!WAnumberDetailsInDB?.user){
			  prisma.$transaction([
          prisma.whatsAppNumbers.upsert({
            create: {
							number: BigInt(String(phoneNumber).slice(-10)),
							countryCode: Number(String(phoneNumber).slice(0, -10)),
              verified: true   
            },
            where: {
              id: WAnumberDetailsInDB.id
            },
            update: {
              number: BigInt(String(phoneNumber).slice(-10)),
							countryCode: Number(String(phoneNumber).slice(0, -10)),
              verified: true
            }
          }),
          prisma.oTP.delete({
            where: {
              id: otpInDB.id
            }
          })
        ]).then((resolvedArray) => {
          let verifiedWAnumber = resolvedArray[0]
          verifiedWAnumber.number = String(verifiedWAnumber.number)
          res.json(verifiedWAnumber)
        }).catch((error) => {
          console.log(`${new Date()}: ${error.stack}`);
          res.status(500).send("Unknown datatbse error has occured")
        })
			}else{
        req.userData = WAnumberDetailsInDB.user;
        next()
      }
		}else{
      res.status(400).send("Incorrect OTP")
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
		res.status(500).send("Internal server error has occured");
	}
}

export default verifyWhatsAppOtp;
