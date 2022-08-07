import { prisma } from "../../../index.js";

function returnAllClaimedCodes(req, res, next){
    let userId = req.userData.id;
    prisma.code.findMany({
        where: {
            claimerId: userId
        },
        select:{
            points: true,
            claimeTime: true
        }
    }).then((resolve) => {
        // change bigInt of claimed time to number to send it over network
        let parsedCodeArray = [];
        for(let i = 0; i < resolve.length; i++){
            parsedCodeArray.push({
                points: resolve[i].points,
                claimeTime: Number(resolve[i].claimeTime)
            })
        }
        res.json({
            totalPoints: req.userData.points,
            codes: parsedCodeArray
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Internal server error has occured")
    })
}

export default returnAllClaimedCodes