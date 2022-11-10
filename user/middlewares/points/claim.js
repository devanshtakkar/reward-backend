import { prisma } from "../../../index.js";

async function claimPoints(req, res, next){
    let code = req.body.code;
    if(!code) res.status(418).send("Invalid Request");
    prisma.code.findFirst({
        where: {
            code: code
        }
    }).then((resolve) => {

        //if no code in the database for the requested one
        if(!resolve){
            res.status(404).send("Invalid Code. Code has Expired");
            return
        }

        //if code is already claimed
        if(resolve.claimed === true){
            res.status(403).send("This code has already been claimed")
            return
        }else{

            //prisma transaction to add to points for the user and update the code's claimed status
            prisma.$transaction([
                prisma.user.update({
                    where: {
                        email: req.userData.email
                    },
                    data: {
                        points: {
                            increment: resolve.points
                        },
                        codesClaimed: {
                            connect: {
                                id: resolve.id
                            },
                        }
                    }
                }),
                prisma.code.update({
                    where: {
                        id: resolve.id
                    },
                    data: {
                        claimed: true,
                        claimeTime: new Date(),
                    }
                })
            ]).then((resolve) => {
                res.json({
                    totalPoints: resolve[0].points,
                    claimedCode : {
                        claimeTime: resolve[1].claimeTime,
                        points: resolve[1].points
                    }
                })
            })
        }
    })
}

export default claimPoints