import {prisma} from "../../../index.js"
import {hashPassword} from "../../../utils/hash.js"
import {generateOTP} from "../../../utils/create-otp.js"
import {sendOtpEmail} from "../../../utils/send-otp-email.js"
import Joi from "joi"
async function createNewUser(req, res, next){
    let body = req.body;

    //Joi validate object
    let validateObj = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20),
        firstName: Joi.string().max(25).required(),
        lastName: Joi.string().max(25),
        occupation: Joi.string().max(15).required()
    }).unknown(true)
    

    //check if the user with the provided email already exists.
    try{
        let validatedData = await validateObj.validateAsync(body)
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
                let otpFunctionResponse = await generateOTP(newUserInDB.email)
                if(otpFunctionResponse instanceof Error){
                    throw new Error("OTP function error")
                }else{
                    sendOtpEmail(newUserInDB.email, `${newUserInDB.firstName} ${newUserInDB.lastName}`, otpFunctionResponse.OTP)
                    res.status(201).json({
                        userId: newUserInDB.id,
                        email: newUserInDB.email,
                        firstName: newUserInDB.firstName,
                        emailVerified: newUserInDB.emailVerified,
                    })
                }
            }
        }
    }catch(err){
        console.log(err)
        if(err.name === "ValidationError"){
            res.status(400).send(err.message)
        }
        if(err.code){
            res.status(500).send("A database error has occured")
        }
        console.log(err)
        res.status(500).send("Internal server error has occured")
    }
}

export {createNewUser}