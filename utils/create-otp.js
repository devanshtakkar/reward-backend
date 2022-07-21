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
            let OTP = Math.floor(Math.random() * 10000);
            let expirydate = Date.now() + 600000;
                let OtpRecord = await prisma.OTP.create({
                    data: {
                        email: email,
                        OTP: addZero(OTP),
                        expiresAt: expirydate,
                    },
                });
                return OtpRecord
        } else {
            let OTP = Math.floor(Math.random() * 10000);
            let expirydate = Date.now() + 600000;
            let newOtpInDB = await prisma.OTP.update({
                where: {
                    email: email
                },
                data: {
                    OTP: addZero(OTP),
                    expiresAt: expirydate,
                }
            })
            return newOtpInDB
        }
      
    }catch(err){
        return err
    }
}

function addZero(OTP) {
	if (OTP < 1000 && OTP > 99) {
		let str = String(OTP);
		str = "0" + str;
		return str
	} else if (OTP < 100 && OTP > 9) {
		let str = String(OTP);
		str = "00" + str;
		return str
	} else if (OTP < 10) {
		let str = String(OTP);
		str = "000" + str;
		return str
	} else {
		return String(OTP)
	}
}

export {generateOTP}
