import { app } from "./app";
import { mealRoutes } from "./routes/meal";
import { userRoutes } from "./routes/user";
//import { env } from "./env";

app.register(userRoutes)
app.register(mealRoutes)

app.listen({ port: 3300 }).then(() => {
    console.log("HTTP Server Running!")
})