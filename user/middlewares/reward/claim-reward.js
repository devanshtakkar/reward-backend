import { prisma } from "../../../index.js";
import fetch from "node-fetch";
async function claimReward(req, res, next) {
	let time = new Date();
	let rewardId = req.body.id;
	let pointsOfUser = req.userData.points;
	let userId = req.userData.id;
	//return the error if rewardId is not mentioned or of incorrect type
	if (!rewardId || typeof rewardId != "number") {
		res.status(400).send("Invalid request");
		return;
	}
	try {
		//claim the reward if the points of the user are more than the points required to claim the reward
		let reward = await prisma.reward.findFirst({
			where: {
				id: rewardId,
			},
		});
		// return error in case the points are insufficient
		if (!reward) {
			res.status(400).send("Incorrect reward id");
			return;
		}
		if (reward.claimable == false) {
			res.status(418).send("This reward is not claimable");
			return;
		}
		if (pointsOfUser < reward.pointsRequired) {
			res
				.status(418)
				.send(
					`This reward requires ${reward.pointsRequired} whereas you only have ${pointsOfUser}.`
				);
			return;
		}
		//claim the reward, subtract the points of the user and send the message on whatsapp
		let dateAndTime = new Date();
		prisma
			.$transaction([
				prisma.rewardsClaimedByUsers.create({
					data: {
						userId: userId,
						claimTime: dateAndTime,
						rewardId: rewardId,
            pointsSubtracted: reward.pointsRequired
					},
				}),
				prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						points: {
							decrement: reward.pointsRequired,
						},
					},
				}),
			])
			.then((resolvedArray) => {
				res.json([
					resolvedArray[0],
					{
						pointsRemaining: resolvedArray[1].points,
					},
				]);
			})
			.then(() => {
				//send the whatsapp notification for claiming of reward
				fetch("https://graph.facebook.com/v15.0/106581678910642/messages", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.WHATSAPP}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						messaging_product: "whatsapp",
						to: "917015845944",
						type: "template",
						recipient_type: "individual",
						template: {
							name: "reward_claim_update",
							language: {
								code: "en",
							},
							components: [
								{
									type: "body",
									parameters: [
										{
											type: "text",
											text: reward.item,
										},
										{
											type: "text",
											text: req.userData.firstName,
										},
									],
								},
							],
						},
					}),
				})
					.then((resolve) => {
						console.log("Whatsapp message sent successfully");
					})
					.catch((error) => {
						console.log(`${time}: ${error.stack}`);
					});
			})
			.catch((error) => {
				console.log(`${time}: ${error.stack}`);
				if (error.code) {
					res.status(500).send("Internal database error");
				}
			});
	} catch (error) {
		
		console.log(`${time}: ${error.stack}`);
		res.status(500).send("Internal server error");
	}
}

export default claimReward;
