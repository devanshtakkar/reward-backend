import jwtPkg from "jsonwebtoken";
import "dotenv/config";
let {verify} = jwtPkg;

async function verifyJwt(req, res, next){
    if(!req.body.jwt) res.status(400).send("No JWT token in the request body")
    verify(body.token, process.env.JWT_SECRET,(err, decode) => {
        if(err){
            res.status(400).send("Authentication token not valid")
        }else{
            res.json({
                jwt: req.body.jwt
            })
        }
    })
}

export {verifyJwt}
