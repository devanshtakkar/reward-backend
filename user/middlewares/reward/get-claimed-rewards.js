import { prisma } from "../../../index.js";

async function getClaimedRewards(req, res, next){
  let userId = req.userData.id;
  let time = new Date();
  try{
    let rewardsClaimedByUser = await prisma.rewardsClaimedByUsers.findMany({
      where: {
        userId,
      }
    })
    res.json(rewardsClaimedByUser)
  }catch(error){
    console.log(`${time}: ${error.stack}`);
    res.status(500).send("Internal server Error")
  }
}

export default getClaimedRewards