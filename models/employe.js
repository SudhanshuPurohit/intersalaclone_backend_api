const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        require: [true, "Firstname is Require"]
    },
    lastname:{
        type: String,
        require: [true, "Firstname is Require"]
    },
    organizationname:{
        type: String,
        require: [true, "Firstname is Require"]
    },
  
    contact:{
        type: String,
        require: [true, "Firstname is Require"],
        minLength: [10, "Invalid Mobile Number"],
        maxLength: [10, "Invalid Mobile Number"],
    },
  
    organizationlogo:{
        type: Object,
        default:{
            fileId:"",
            url:"https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
        }
    },


    email: {
        type: String,
        require:[true, "Email is Required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true,

    }
,
    password: {
        type: String,
        select: false,
        // match :[],
        
        minLength: [6, "The length of password must be atleast 6"],
        maxLength: [15, "The length of password should be less than 15"]
    },

    internships:[{type: mongoose.Schema.ObjectId, ref: 'internship'}],
    jobs:[{type: mongoose.Schema.ObjectId, ref: 'job'}],
    
    resetPasswordToken: {
        type: String,
        default: "0",
    }

}, {timestamps: true});


employeSchema.pre("save", function(){

    if(this.isModified("password")){
        let salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

});

// to check the password of employe 
employeSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password);
}


// Method to generate token
const jwt = require("jsonwebtoken");
employeSchema.methods.generateToken = function (){
    return jwt.sign({id: this._id}, "secret key for jwt", {expiresIn: '24h'});
}



const employeModel = mongoose.model("employe", employeSchema);

module.exports = employeModel;