import express from "express";
import initalizeroutes from "./routes.js"
const app = express();

const port = 8000;

// are global error handlers in Node.js for catching serious, application-wide errors that aren’t handled elsewhere. 

process.on('uncaughtException', (error) => {
    console.error("errors in the code",error)
  })// Catches synchronous errors thrown outside of a try...catch block anywhere in your code.
  
  process.on('unhandledRejection', (error) => {
    console.error("error out of express",error)
  }) // // No .catch(), so this triggers 'unhandledRejection'



app.use(express.json());// Middleware to parse json 
// can use cors as well  

// Calling the 'initalizeroutes' function and passing the 'app' instance to it.
// This function will declare or import routes in the 'routes.js' file.
initalizeroutes(app);

app.listen(port, ()=>{
    console.log("server up and running on",port);
})