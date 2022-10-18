import { prisma } from "../../../index.js";
import Joi from "joi";

async function deleteReward(req, res, next) {
	let idArray = req.body.id;
	//check if the request containes the reward id array
	if (!idArray) res.status(400).send("Invalid or no data in request");

	//joi object for validating data
	let joiObject = Joi.array().items(Joi.number().min(1));

	try {
		let validatedArray = await joiObject.validateAsync(idArray);
    let deletedRewards = await prisma.reward.deleteMany({
      where: {
        id: {
          in: validatedArray
        }
      }
    })
    res.send(deletedRewards)
	} catch (error) {
		if (error.name === "ValidationError") {
			res.status(400).send(error.message);
		}else if(error.code == "P2003"){
      res.status(418).send("Cannot delete rewards already claimed by the user")
    }else{
      res.status(500).send("Internal server error")
    }
	}
}

export default deleteReward;
