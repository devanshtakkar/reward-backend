import {prisma} from "../../../index.js"
import Joi from "joi"

async function createNewUserAuthByWhatsapp(req, res, next){
  let joiObject = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    occupation: Joi.string().required(),
    whatsApp: Joi.string().regex(/^[0-9]{10}$/, { name: "Phone Number" }).required(),
    countryCode: Joi.number().min(1).max(1000).required(),
    email: Joi.string().email(),  
  })
}

export default createNewUserAuthByWhatsapp