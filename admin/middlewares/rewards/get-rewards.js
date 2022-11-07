import { prisma } from "../../../index.js";

async function retreiveRewardsFromDatabase(req, res, next){
  //if claimable is given in request then apply the filter otherwise return all the results
  let claimable = req.query.claimable
  if(claimable == "true" || claimable == "false"){
    switch (claimable){
      case "true":
        claimable = true
        break;
      case "false":
        claimable = false
        break;
    }
    try{
      let rewardsInDB = await prisma.reward.findMany({
        where: {
          claimable: claimable
        }
      });
      res.json(rewardsInDB)
    }catch(error){
      res.status(500).send("Internal server error")
    }
  }else{
    //run if no claimable query is not provided
    try{
      let rewardsInDB = await prisma.reward.findMany({});
      res.json(rewardsInDB)
    }catch(error){
      res.status(500).send("Internal server error")
    }
  }
}

export default retreiveRewardsFromDatabase