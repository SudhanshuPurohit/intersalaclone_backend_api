exports.generatedError = (err, req, res, next)=>{

    const statusCode = err.statusCode || 500;

    if(err.name == "MongoServerError" && err.message.includes("E11000 duplicate key error collection")){
        err.message = "The Student With This Email Address Already Exists"
    }

 
    res.status(statusCode).json({
        message: err.message,
        errName: err.name,
    })
}