import express from "express";
import initalizeroutes from "./routes.js"
const app = express();

const port = 8000;

app.use(express.json());// Middleware to parse json 

// Calling the 'initalizeroutes' function and passing the 'app' instance to it.
// This function will declare or import routes in the 'routes.js' file.
initalizeroutes(app);

app.listen(port, ()=>{
    console.log("server up and running on",port);
})