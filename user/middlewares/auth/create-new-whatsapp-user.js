import { prisma } from "../../../index.js";
import Joi from "joi";

async function createNewUserAuthByWhatsapp(req, res, next) {
  let body = req.body;
	let joiObject = Joi.object({
		number: Joi.string()
			.regex(/^[0-9]{10}$/, { name: "Phone Number" })
			.required(),
		countryCode: Joi.number().min(1).max(1000).required(),
		firstName: Joi.string().max(50).required(),
		lastName: Joi.string().max(50),
		occupation: Joi.string().max(20).required(),
		email: Joi.string().email(),
	});
  try{
    let verifiedData = await joiObject.validateAsync(body);
    let WAnumberInDB = await prisma.whatsAppNumbers.findFirst({
      where: {
        AND: [
          {
            number: {
              equals: BigInt(verifiedData.number),
            }
          },
          {
            countryCode: verifiedData.countryCode
          }
        ]
      },
      include: {
        user: true
      }
    })

    //restructure the verified data
    delete verifiedData.number;
    delete verifiedData.countryCode;
    // verifiedData.whatsAppNumberId = WAnumberInDB.id;
    verifiedData.loginProvider = "whatsapp"
    verifiedData.whatsAppNumber = {
      connect: {
        id: WAnumberInDB.id
      }
    }
    if(WAnumberInDB?.user){
      console.log(WAnumberInDB)
      res.status(400).send("Invalid WhatsApp number or this number is being already connect with another account");
      return
    }
    prisma.user.create({
      data: verifiedData
    }).then((newUserInDB) => {
      req.userData = newUserInDB;
      next()
    }).catch((error) => {
      console.log(`${new Date()}: ${error.stack}`);
      res.status(500).send("Internal server error while creating the user")
    })

  }catch(error){
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

export default createNewUserAuthByWhatsapp;
