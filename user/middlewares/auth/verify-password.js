import { prisma } from "../../../index.js";
import { hashPassword } from "../../../utils/hash.js";

async function verifyPassword(req, res, next) {
	if (!req.body.email) res.status(400).send("No email in request");
	if (!req.body.password) res.status(400).send("No password in request");
	try {
		let enteredPassHash = await hashPassword(req.body.password);
		let userInDB = await prisma.user.findFirst({
			where: {
				AND: [
					{
						email: req.body.email,
					},
					{
						passwordHash: enteredPassHash,
					},
				],
			},
		});
		if (!userInDB) {
			res.status(401).send("Incorrect password or email");
		} else {
			req.userData = userInDB;
			next();
		}
	} catch (err) {
		res.status(500).send("Unknown Server Error");
		console.log(err);
	}
}

export { verifyPassword };
