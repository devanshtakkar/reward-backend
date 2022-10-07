import { prisma } from "../../../index.js";
import Joi from 'joi';

async function updateReward(req, res, next){
  let body = req.body.reward;
  //return the error if empty request
  if(!body){
    res.status(400).send("Empty request")
    return
  }
  //joi validation object
  let joiObject = Joi.object({
    id: Joi.number().greater(-1).max(10000),
    pointsRequired: Joi.number().greater(0).max(10000),
    claimable: Joi.boolean()
  })

  //handling request
  try{
    let validatedData = await joiObject.validateAsync(body);
    let id = validatedData.id

    //deleting the id from the validated data to use it in prisma query
    delete validatedData.id
    let updatedRewardInDB = await prisma.reward.update({
      where: {
        id: id
      },
      data: validatedData
    })
    res.json(updatedRewardInDB)
  }catch(error){
    if(error.name === "ValidationError"){
      res.status(400).send(error.message)
    }else{
      res.status(500).send("Internal server error")
    }
  }

}

export default updateReward