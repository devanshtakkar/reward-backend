import jwt from "jsonwebtoken";
function getLoginStatus(req, res, next){
    if(!req.body.jwt){
        res.status(400).send("No JWT supplied in the request");
        return
    }
    jwt.verify(req.body.jwt, process.env.JWT_SECRET,(error, decoded) => {
        if(error){
            res.status(500).send("Error while verifying JWT");
            return
        }
        res.json({
            login: true
        })
    })
}

export default getLoginStatus