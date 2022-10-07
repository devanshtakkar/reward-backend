import { prisma } from "../../../index.js";
import Joi from 'joi'

async function createNewReward(req, res, next){
  let body = req.body;

  //in case of no reward in the request
  if(!body.rewards){
    res.status(400).send("Empty request");
    return
  }
  //Joi validation code
  let joiObject = Joi.object({
    item: Joi.string().max(15).required(),
    pointsRequired: Joi.number().greater(0).max(10000).required(),
    claimable: Joi.boolean().required()
  })

  let joiArray = Joi.array().items(joiObject);

  //handling the actual request
  try{
    //verify the reward array in the body
    let verifiedData = await joiArray.validateAsync(body.rewards);

    //add the records in the database
    let newRewardsInDatabase = await prisma.reward.createMany({
      data: verifiedData
    });
    res.status(201).json(newRewardsInDatabase);
    
  }catch(error){
    console.log(error)
    if(error.name === "ValidationError"){
      res.status(400).send(error.message)
    }else{
      res.status(500).send("Internal server error")
    }
  }

  
}

export default createNewReward