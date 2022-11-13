import { prisma } from "../../../index.js";
import Joi from "joi";

async function updateUserDetails(req, res, next) {
	let data = req.body;
  let joiObject = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    occupation: Joi.string(),
    whatsApp: Joi.string().regex(/^[0-9]{10}$/, { name: "Phone Number" }),
    countryCode: Joi.number().min(1).max(1000),
    email: Joi.string().email(),  
  });
	try {
		let verifiedData = await joiObject.validateAsync(data);
		let userId = verifiedData.id;
    verifiedData.whatsApp = BigInt(verifiedData.whatsApp);
		delete verifiedData.id;
		let updatedDataOfUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: verifiedData,
		});
		res.json({ updatedDataOfUser });
	} catch (error) {
		console.log(`${new Date()}: ${error.stack}`);
		if (error.name === "ValidationError") {
			res.status(400).send(error.message);
		} else {
			res.status(500).send("Internal server error");
		}
	}
}

export default updateUserDetails;
