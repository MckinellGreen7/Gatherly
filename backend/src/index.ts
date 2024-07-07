import { Hono } from 'hono'
import { adminRouter } from './routes/admin.routes'
import { userRouter } from './routes/user.routes'
import { eventRouter } from './routes/event.routes'
import { cors } from 'hono/cors'
const app = new Hono()
app.use("/*", cors())
app.route("/api/v1/admin", adminRouter)
app.route("/api/v1/user", userRouter)
app.route("/api/v1/event", eventRouter)

export default app

