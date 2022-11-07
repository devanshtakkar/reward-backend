import { prisma } from "../../index.js";

//create codes in database
async function createCodes(req, res, next) {
	if (req.body.codes instanceof Array) {
		try{
			let newCodesInDB = await prisma.code.createMany({
				data: req.body.codes
			})
			res.status(201).send(newCodesInDB)
		}catch(err){
			res.status(500).send("Error while generating Codes")
		}
	} else {
		res
			.status(500)
			.send("Incorrect body received. Expected JSON Array");
	}
}

// codes from database 
async function deleteCodes(req, res, next) {
	if (req.body.codes instanceof Array) {
		let responseData = 0;
		//iteration count is required because for each loop function is running asynchrously
		let iterationCount = 0;
		try {
			req.body.codes.forEach(async (element, index, array) => {
				let deletedCodesInDB =
					await prisma.$executeRaw`DELETE FROM codes WHERE points=${element.points} AND claimed=0 LIMIT ${element.quantity}`;
				responseData = responseData + deletedCodesInDB;
				iterationCount = iterationCount + 1;
				console.log(req.body.codes.length)
				if (iterationCount == req.body.codes.length) {
					res.json({ deleted: responseData });
				}
			});
		} catch (error) {
			console.log(error)
			res.status(500).send("Unable to delete codes from the database");
		}
	} else {
		res
			.status(500)
			.send("Incorrect body received. Expected JSON Array");
	}
}

// retreive the created codes details from database
async function getCodes(req, res, next){
	let queryObj = createQueryObjForDbOperation(req.query);
	try{
		let codesInDB = await prisma.code.findMany({
			// where: queryObj,
		})
		res.send(codesInDB)
	}catch(err){
		console.log(err)
		res.status(500).json("Internal server error has occured")
	}
}

function createQueryObjForDbOperation(queryObj){
	let obj = {};
	if(queryObj.points){
		let points = Number(queryObj.points);
		obj.points = points
		obj.claimed = Boolean(Number(queryObj.claimed))
	}else{
		obj.claimed = Boolean(Number(queryObj.claimed))
	}
	return obj
}


export { createCodes, deleteCodes, getCodes};
