import { prisma } from "../../../index.js";
import saveImage from "./functions/save-image-promise.js";
import { v4 } from "uuid";
import Joi from "joi";

async function updateReward(req, res, next) {
	let body = req.body;
	//joi validation object
	let joiObject = Joi.object({
    item: Joi.string(),
		id: Joi.number().greater(-1).max(10000),
		pointsRequired: Joi.number().greater(0).max(10000),
		claimable: Joi.boolean(),
	});

	//handling request
	try {
		let validatedData = await joiObject.validateAsync(body);
		let id = validatedData.id;

		//deleting the id from the validated data to use it in prisma query
		delete validatedData.id;

		//if the patch request doesn't change the image just update the details
		if (!req.files?.image) {
			let updatedRewardInDB = await prisma.reward.update({
				where: {
					id: id,
				},
				data: validatedData,
			});
			res.json(updatedRewardInDB);
			return;
		} else {
			// if the patch request changes the image

			//create a random name for the image
			let nameForImage = v4();

			//add the image name to the validated data object
			validatedData.image = `${nameForImage}.jpg`;

			//run promise all to save the image and update the records simontanously
			Promise.all([
				saveImage(req.files, nameForImage),
				prisma.reward.update({
					where: {
						id: id,
					},
					data: validatedData,
				}),
			])
				.then((resolvedArray) => {
					res.json(resolvedArray[1]);
				})

        //catch the error of the Promise API
				.catch((error) => {
					console.log(error);
					if (error.name === "ValidationError") {
						res.status(400).send(error.message);
					} else {
						res.status(500).send("Internal server error");
					}
				});
		}
	} catch (error) {
    console.log(`${new Date()}: ${error.stack}`)
		if (error.name === "ValidationError") {
			res.status(400).send(error.message);
		} else {
			res.status(500).send("Internal server error");
		}
	}
}

export default updateReward;
