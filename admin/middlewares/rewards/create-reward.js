import { prisma } from "../../../index.js";
import Joi from "joi";
import saveImage from "./functions/save-image-promise.js";
import { v4 } from "uuid";

async function createNewReward(req, res, next) {
	let body = req.body;

	let joiObject = Joi.object({
		item: Joi.string().max(15).required(),
		pointsRequired: Joi.number().greater(0).max(10000).required(),
		claimable: Joi.boolean().required(),
	});

	//handling the actual request
	try {
		//verify the body
		let verifiedData = await joiObject.validateAsync(body);

		//create a random name for image
		let nameOfImage = v4();

		//save the image on server and details in database
		Promise.all([
			saveImage(req.files, nameOfImage),
			prisma.reward.create({
				data: {
					item: verifiedData.item,
					pointsRequired: verifiedData.pointsRequired,
					claimable: verifiedData.claimable,
					image: `${nameOfImage}.jpg`,
				},
			}),
		]).then((resolvedArray) => {
			//return the created reward details
			res.json(resolvedArray[1]);
		}).catch((error) => {
      if (error.name === "ImageError") {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Internal server error");
      }
    })
	} catch (error) {
		console.log(error);
		if (error.name === "ValidationError") {
			res.status(400).send(error.message);
		} 
		else {
			res.status(500).send("Internal server error");
		}
	}
}

export default createNewReward;
