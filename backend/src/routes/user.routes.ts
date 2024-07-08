import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign,verify } from "hono/jwt";
import { comparePassword, hashPassword } from "../middleware/authentication.middleware";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>


userRouter.post('/signup', async(c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    body.password = await hashPassword(body.password)
    try{
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                age: body.age
            }
        })

        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET)

        return c.text(jwt)
    } catch(error){
        c.status(404)
        return c.text("Invalid")
    }
})


userRouter.post('/signin', async(c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            }
        })
        if (!user){
            return c.text("Wrong email.")
        }

        const isPasswordValid = await comparePassword(body.password, user.password)
        if (!isPasswordValid){
            return c.text("Wrong password.")
        }
        
        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET)

        return c.text(jwt)
    } catch(error){
        c.status(404)
        return c.text("Invalid")
    }
})

userRouter.use("/*",async (c,next) => {
    const authHeader = c.req.header("authorization") || ""
    try{
    const main = await verify(authHeader, c.env.JWT_SECRET)
    if (main){
        c.set('mainId', main.id)
        await next()
    }
    else{
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }
    } catch(err){
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }
})

userRouter.get("/profile/:id", async (c) => {
    const userId = parseInt(c.req.param("id"))
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!user){
        return c.text("you are not a admin")
    }

    return c.json(user)

})