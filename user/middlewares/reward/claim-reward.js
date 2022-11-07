import { prisma } from "../../../index.js"
import fetch from "node-fetch"
async function claimReward(req, res, next){
  let rewardId = req.body.id;
  //return the error if rewardId is not mentioned or of incorrect type
  if(!rewardId || typeof rewardId != number){
    res.status(400).send("Invalid request");
    return
  }
  try{
    

  }catch(error){
    let time = new Date()
    console.log(`${time}: ${error.message}`)
  }

}

export default claimReward