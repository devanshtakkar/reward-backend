import jwt from "jsonwebtoken";
function verifyJwt(req, res, next) {
	let method = req.method;
	if (method == "GET") {
		if (!req.query.jwt) {
			res.status(400).send("No JWT supplied in the request");
			return;
		}
		jwt.verify(req.body.jwt, process.env.JWT_SECRET, (error, decoded) => {
			if (error) {
				res.status(406).send("Error while verifying JWT");
				return;
			}
			next();
		});
	} else {
		if (!req.body.jwt) {
			res.status(400).send("No JWT supplied in the request");
			return;
		}
		jwt.verify(req.body.jwt, process.env.JWT_SECRET, (error, decoded) => {
			if (error) {
				res.status(406).send(error.message);
				return;
			}
			next();
		});
	}
}

export default verifyJwt;
