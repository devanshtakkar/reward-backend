import jwtPkg from "jsonwebtoken";
import "dotenv/config";
let {verify} = jwtPkg;

async function verifyJwt(req, res, next){
    let authHeader = req.header("authorization")
    if(!authHeader){
        res.status(400).send("No authorization header in the request")
        return
    }
    let authHeaderArray = authHeader.split(" ")
    let token = authHeaderArray[1];
    verify(token, process.env.JWT_SECRET,(err, decode) => {
        if(err){
            res.status(401).send("Authentication token not valid")
        }else{
            res.json(decode)
        }
    })
}

export {verifyJwt}
