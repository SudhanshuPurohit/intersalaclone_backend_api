const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");


exports.isAuthenticated = catchAsyncErrors(async (req, res, next)=>{
     
    const {token} = req.cookies;

    if(!token) {
        next(new ErrorHandler("Please Login to access"), 401)
    }

    const {id} = jwt.verify(token, "secret key for jwt");
    req.id = id;
    next();
})