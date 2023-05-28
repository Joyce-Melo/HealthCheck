import { app } from "./app";
import { userRoutes } from "./routes/user";
//import { env } from "./env";

app.register(userRoutes)

app.listen({ port: 3300 }).then(() => {
    console.log("HTTP Server Running!")
})