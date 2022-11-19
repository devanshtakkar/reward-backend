import {prisma} from "../index.js"

//generate OTP for a specific email and send email
async function generateOTP(email) {
    try{
        let oldOtpRequest = await prisma.OTP.findFirst({
            where: {
                email: email,
            },
        });
        if (!oldOtpRequest) {
            let otp = 0;
            do {
                otp = Math.floor(Math.random() * 1000000);
            } while (otp <= 100000);
            let expirydate = Date.now() + 600000;
                let OtpRecord = await prisma.OTP.create({
                    data: {
                        email: email,
                        OTP: otp,
                        expiresAt: expirydate,
                    },
                });
                return OtpRecord
        } else {
            let otp = 0;
            do {
                otp = Math.floor(Math.random() * 1000000);
            } while (otp <= 100000);
            let expirydate = Date.now() + 600000;
            let newOtpInDB = await prisma.OTP.update({
                where: {
                    email: email
                },
                data: {
                    OTP: otp,
                    expiresAt: expirydate,
                }
            })
            return newOtpInDB
        }
      
    }catch(err){
        return err
    }
}

export {generateOTP}
