import jwt from "jsonwebtoken";
function verifyJwt(req, res, next) {
	let authHeader = req.header("authorization");
	//remove the Bearer part
	let array = authHeader.split(" ");
	let token = array[1];
	jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
		if (error) {
			console.log(error);
			res.status(403).send(error.message);
		} else {
			next()
		}
	});
}

export default verifyJwt;
