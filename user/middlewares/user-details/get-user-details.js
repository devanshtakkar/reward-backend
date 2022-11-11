import {prisma} from "../../../index.js"
async function getUserDetails(req, res, next){
  let userId = req.userData.id;
  try{
    let userInDB = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    //delete the private details from the user object before sending them
    delete userInDB.loginProvider;
    delete userInDB.passwordHash;
    res.json(userInDB)
  }catch(error){
    let time = new Date();
    console.log(`${time}: ${error.stack}`);
    res.status(500).send("Internal Server error")
  }
}

export default getUserDetails