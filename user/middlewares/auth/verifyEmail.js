import {prisma} from "../../../index.js"

async function verifyEmail(req, res, next){
    let email =  req.query.email;
    let link = req.query.link;
    console.log(email, link)
    if(!(email && link)){
        res.status(400).send("Invalid parameters")
    }
    try{
        let verifyLinkInDB = await prisma.verificationLink.findFirst({
            where:{
                email: email,
                link: link
            }
        })
        console.log(verifyLinkInDB)
        if(verifyLinkInDB){
            if(verifyLinkInDB.expiresAt > Date.now()){
                await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        emailVerified: true
                    }
                })
                res.redirect("https://ezeeroll.in/verified")
            }else{
                res.status(406).send("Verification link has expired")
            }
        }else{
            res.status(406).send("Verification link has expired or not valid")
        }
    }catch(error){
        if(error.code){
            res.status(500).send("database error")
        }else{
            res.status(500).send("Internal server error")
        }
    }
}

export {verifyEmail}