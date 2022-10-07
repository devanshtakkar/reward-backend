import jwt from "jsonwebtoken";
function login(req, res, next){
    if(!req.body.password){
        res.status(400).send("No password in the request");
        return
    }
    if(req.body.password == process.env.ADMIN_PASSWORD){
        jwt.sign({
            login: true
        },process.env.JWT_SECRET,{
            expiresIn: "2d"
        },(error, jwtString) => {
            if(error){
                res.status(500).send("Error while generating JWT");
                return
            }
            res.json({
                jwt: jwtString
            })
        })
    }else{
        res.status(401).send("Incorrect password")
    }
}

export default login