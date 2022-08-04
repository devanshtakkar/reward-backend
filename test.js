//  Promise.all([
// 	prisma.passwordResetLink.upsert({
// 		where: {
// 			email: validatedEmail,
// 		},
// 		create: {
// 			email: validatedEmail,
// 			linkPath: url.href,
// 			expiresAt: Date.now() + 1000 * 60 * 60 * 24,
// 		},
// 		update: {
// 			linkPath: url.href,
// 			expiresAt: Date.now() + 1000 * 60 * 60 * 24,
// 		},
// 	}),

//  ]).then((res, rej) => console.log( res)).catch((err) => console.log(err))

console.log(new Promise((res, rej) => {}))