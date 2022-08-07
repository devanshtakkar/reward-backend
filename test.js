import {prisma} from "./index.js"

prisma.code.findFirst({
    select:{
        claimeTime: true
    }
}).then((res) => {
    console.log(typeof(res.claimeTime))
    console.log(Number(res.claimeTime))
})