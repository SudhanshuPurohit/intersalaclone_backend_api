// to read the env file require dotenv
require("dotenv").config({ path: "./.env" });

const express = require("express");
const app = express();

// cors
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

// connect db 
require("./models/mongodbconnect").mongooseConnect();


// logger - morgan (to print which route is hit)
const logger = require("morgan");
app.use(logger("tiny"));


// Body parser for the body request

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// session and cookies

const session = require("express-session");
const cookiesparser = require("cookie-parser");


app.use(session({
    resave: true,
    saveUninitialized: true, secret: "session_secret"
}));




app.use(cookiesparser());


// express - fileupload
const  fileupload = require("express-fileupload");
app.use(fileupload());


// Not modulated:
// app.get("/", (req, res, next)=>{
//     res.json({msg: "home route"})
// })


// moduleted code outsource in another folder called routes and components:

// All Routes 
app.use("/", require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/employe", require("./routes/employeRoutes"));

// ERROR Handling
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedError } = require("./middlewares/error");

app.all("*", (req, res, next) => {

    next(new ErrorHandler(`Request URL Not Found ${req.url}`, 404));

});


// Middle-Ware 
app.use(generatedError);




app.listen(process.env.port, console.log(`server started at port ${process.env.port}`));



