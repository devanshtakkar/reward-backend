import {generateOTP} from "../../../utils/create-otp.js"
import {sendOtpEmail} from "../../../utils/send-otp-email.js"

async function resendOtp(req, res, next){
    if(!("email" in req.query)) res.status(400).send("No email provided in the request")
    let email = req.query.email;
    try{
        let createOtpResponse =  await generateOTP(email);
        if(createOtpResponse instanceof Error){
            throw new Error("OTP function error")
        }else{
            sendOtpEmail(email, undefined , createOtpResponse.OTP)
            res.status(201).json({
                email: email,
                emailVerified: false
            })
        }
    }catch(err){
        console.log(err);
        if(err.code){
            res.status(500).send("Database Error")
        }else{
            res.status(500).send("Internal server Error")
        }
    }
}

export {resendOtp}