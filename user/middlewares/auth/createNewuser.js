import {prisma} from "../../../index.js"
import {hashPassword} from "../../../utils/hash.js"
import {sendVerificationEmail} from "../../../utils/send-verification-email.js"
async function createNewUser(req, res, next){
    let body = req.body;

    //check if teh user with the provided email already exists.
    try{
        let userInDB = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
        if(userInDB){
            res.status(403).send(`Cannot create a new user. A user with this email already exists`)
        //create new user if an user does not exist
        }else{
            let passwordHash = await hashPassword(body.password)
            let newUserInDB =  await prisma.user.create({
                data: {
                    email: body.email,
                    passwordHash: passwordHash,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    occupation: body.occupation,
                    emailVerified: false,
                    loginProvider: 'email'
                }
            })
            //send verification email after the creation of the user in database
            if(newUserInDB){
                sendVerificationEmail(newUserInDB.email, newUserInDB.firstName);
                res.status(201).json({
                    emailVerification: "pending"
                })
            }
        }
    }catch(err){
        if(err.code){
            res.status(500).send("A database error has occured")
        }
        console.log(err)
        res.status(500).send("Internal server error has occured")
    }
}

export {createNewUser}