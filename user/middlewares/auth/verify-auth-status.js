import jwtPkg, { decode } from "jsonwebtoken";
import { prisma } from "../../../index.js";

let {verify} = jwtPkg;

async function verifyAuthStatus(req, res, next){
    let authHeader = req.header("authorization")
    //remove the Bearer part
    let array = authHeader.split(" ");
    let jwt = array[1];
    verify(jwt,process.env.JWT_SECRET,(error, decode) => {
        if(error){
            console.log(error)
            res.status(400).send("Invalid request")
        }else{
            prisma.user.findFirst({
                where: {
                    email: decode.email
                }
            }).then((resolve, reject) => {
                req.userData = resolve;
                next()
            }).catch((error) => {
                console.log(error);
                res.status(500).send("Internal server error. Please try again later")
            })
        }
    })
}

export default verifyAuthStatus