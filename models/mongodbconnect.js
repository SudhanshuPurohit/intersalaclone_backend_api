const mongoose = require("mongoose");

exports.mongooseConnect = async ()=>{
    try{

        await mongoose.connect("mongodb://127.0.0.1:27017/internsalaclone");
        console.log("DB connected")
    }
    catch(err){
        console.log(err);
    }
}

