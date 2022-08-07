import { prisma } from "../../../index.js";

async function renderPasswordResetPage(req, res, next){
    let email = req.query.email;
    let token = req.query.token;
    if(email && token){
        try{
            let resetUrlInDB = await prisma.passwordResetLink.findFirst({
                where: {
                    email: email
                }
            })
            if(resetUrlInDB?.expiresAt > Date.now()){
                res.render("reset-password",{
                    email,
                })
            }else{
                res.render("error",{
                    error: "Not found: 404",
                    message: "The reset link has expired or does not exist please make a request for new Link"
                })
            }
    
        }catch(error){
            console.log(error)
            res.render("error",({
                error: "Internal server Error: 500",
                message: "The server currently appears to be having some issues. Please try again later"
            }))
        }
    }else{
        res.render("error",({
            error: "Client Error: 400",
            message: "Invalid url"
        }))    
    }
}

export default renderPasswordResetPage