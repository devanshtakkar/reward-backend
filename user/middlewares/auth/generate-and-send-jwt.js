import jwtPkg, { decode } from "jsonwebtoken";
import "dotenv/config";
let {sign} = jwtPkg;

async function makeAndSendJwt(req, res, next){
    if(!req.userData) res.status(400).send("Invalid request")
    sign({
        userId: req.userData.id,
        email: req.userData.email,
        firstName: req.userData.firstName,
        lastName: req.userData.lastName,
        emailVerified: req.userData.emailVerified
    },process.env.JWT_SECRET,(err, token) => {
        if(err){
            res.status(500).send("Internal server error while generating authentication token")
        }else{
            res.json({
                jwt: token
            })
        }
    })
}

export {makeAndSendJwt}