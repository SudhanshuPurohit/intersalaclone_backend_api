const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    students:[{type: mongoose.Schema.ObjectId, ref:"student"}],

    employe: {type: mongoose.Schema.ObjectId, ref:"employe"},

    title:{
        type: String,
        require: [true, "Title is Require"]
    },
    skills:{
        type: String,
        require: [true, "skills is Require"]
    },
    jobtype:{
        type: String,
        enum: ["In office", "Remote"],
    },
    openings: String,
    
    responsiblity:{
       type: String
    },
    description:{
       type: String
    },

    salary:{
        type: Number
    },
    perks:{
        type: String,
    },
   
}, {timestamps: true});



const jobModel = mongoose.model("job", jobSchema);

module.exports = jobModel;