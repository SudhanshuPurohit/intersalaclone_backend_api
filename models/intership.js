const mongoose = require("mongoose");



const internshipSchema = new mongoose.Schema({
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
    internshiptype:{
        type: String,
        enum: ["In office", "Remote"],
    },
    openings: String,
    from:String,
    to: String,
    duration: String,
    responsiblity:{
       type: String
    },

    stipend:{
        status: {type: String , enum: ["Fixed", "Negotiable", "Performace based", "Unpaid"]}, 
        amount: Number,
    },
    perks:{
        type: String,
    },
   
}, {timestamps: true});



const internshipModel = mongoose.model("internship", internshipSchema);

module.exports = internshipModel;