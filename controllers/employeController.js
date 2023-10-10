// exports.homeController = (req, res,next)=>{
//     res.json({msg: "home route"});
// }

const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const employeModel = require("../models/employe");
const internshipModel = require("../models/intership");
const jobModel = require("../models/jobs");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendToken } = require("../utils/employeSendToken");
const { sendMail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imagekit").initImagekit();


exports.homeController = catchAsyncErrors(async (req, res, next) => {
    res.json({ msg: "employe secured Route" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
    const employe = await employeModel.findById(req.id).populate("internships").populate("jobs").exec();
    res.json(employe);
});


exports.employeSignup = catchAsyncErrors(async (req, res, next) => {
    const employe = await new employeModel(req.body).save();
    // res.status(201).json(employe);
    sendToken(employe, 201, res);

});


exports.employeSignin = catchAsyncErrors(async (req, res, next) => {
    const employe = await employeModel.findOne({ email: req.body.email }).select("+password").exec();

    if (!employe) return (next(new ErrorHandler("This Email don't Exist", 404)));


    const isMatch = employe.comparePassword(req.body.password);

    if (!isMatch) return (next(new ErrorHandler("Wrong Password", 500)));

    // res.json(employe);
    sendToken(employe, 201, res);

});

exports.employeSignout = catchAsyncErrors(async (req, res, next) => {

    res.clearCookie("token");
    res.json({ message: "SignOut SuccessFully" });
});


// send mail
exports.passwordResetLinkMailemploye = catchAsyncErrors(async (req, res, next) => {

    
    const employe = await employeModel.findOne({ email: req.body.email }).exec();

    if (!employe) return (next(new ErrorHandler("This Email don't Exist", 404)));

    const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

    employe.resetPasswordToken = `${otp}`;

    sendMail(req, res, next, otp);

    employe.save();
    res.status(200).json({
        employe, otp
    });
});

exports.employeForgotLink = catchAsyncErrors(async (req, res, next) => {

    const employe = await employeModel.findOne({email:req.body.email}).exec();

    if (!employe) return (next(new ErrorHandler("This Email don't Exist", 404)));


    if (employe.resetPasswordToken == req.body.otp) {
        employe.resetPasswordToken = "0000";
        employe.password = req.body.password;
        await employe.save();
        res.status(200).json({ msg: "Password Change Sucessully" });
    }

    else {
        return next(new ErrorHandler("Otp Is Invalid", 500))
    }


});

exports.employePasswordReset = catchAsyncErrors(async (req, res, next) => {

    const employe = await employeModel.findById(req.id).exec();
    if (!employe) return (next(new ErrorHandler("This Email don't Exist", 404)));

    employe.password = req.body.password;
    employe.save();
    res.status(200).json({ msg: "Password Change Sucessully" });

});

exports.updatedemploye =  catchAsyncErrors(async (req, res, next) => {

    const employe = await employeModel.findByIdAndUpdate(req.id, req.body).exec();
    employe.save();
    res.status(200).json({success: true, msg: "employe Updated Sucessully" , employe});

});

exports.uploadImageemploye =  catchAsyncErrors(async (req, res, next) => {

    const employe = await employeModel.findByIdAndUpdate(req.id, req.body).exec();
    const file = req.files.organizationlogo;
    const updatedFileName = `organizationlogo-upload-${Date.now()}-${file.name}-${path.extname(file.name)}`;
    if(employe.organizationlogo.fileId !== ""){
        await imagekit.deleteFile(employe.avatar.fileId);
    }
    const {fileId, url} = await imagekit.upload({file: file.data, fileName: updatedFileName});
    employe.organizationlogo = {fileId, url}
    employe.save();
    res.status(200).json({
        success: true,
        message: "Image uploaded successfully"
    });

});


// --------------------------------------Internship create by employe -------------------------------

exports.createInternship = catchAsyncErrors(async (req, res, next) => {
    const employe = await employeModel.findById(req.id).exec();
    const internship = await new internshipModel(req.body);
    employe.internships.push(internship._id);
    internship.employe = employe._id;
    employe.save();
    internship.save();
    res.status(201).json({success: true , msg: "Internship Created Successfully", internship});
});

exports.readallInternships = catchAsyncErrors(async (req, res, next) => {
    const internship = await internshipModel.find().exec();
    
    res.status(200).json({success: true , internship});
});

exports.readallInternshipsOfEmploye = catchAsyncErrors(async (req, res, next) => {
    const employe = await employeModel.findById(req.id).populate("internships").exec();
    res.status(200).json({success: true , employe});
});

exports.readOneInternships = catchAsyncErrors(async (req, res, next) => {
    const internship = await internshipModel.findById(req.params.id).exec();
    res.status(200).json({success: true , internship});
});

// --------------------------------------job create by employe -------------------------------

exports.createJob = catchAsyncErrors(async (req, res, next) => {
    const employe = await employeModel.findById(req.id).exec();
    const job = await new jobModel(req.body);
    employe.jobs.push(job._id);
    job.employe = employe._id;
    employe.save();
    job.save();
    res.status(201).json({success: true , msg: "Job Created Successfully", job});
});

exports.editJob = catchAsyncErrors(async (req, res, next) => {
    const internship = jobModel.findByIdAndUpdate(req.params.id);
    internship.save();
    res.status(201).json({success: true , msg: "Job Edit Successfully", internship});
});

exports.editInternship = catchAsyncErrors(async (req, res, next) => {
    const internship = internshipModel.findByIdAndUpdate(req.params.id, req.body);
    internship.save();
    res.status(201).json({success: true , msg: "Job Edit Successfully", internship});
});



exports.readallJobs = catchAsyncErrors(async (req, res, next) => {
    const internship = await internshipModel.find().exec();
    res.status(200).json({success: true , internship});
});

exports.readallJobsOfEmploye = catchAsyncErrors(async (req, res, next) => {
    const employe = await employeModel.findById(req.id).populate("internships").exec();
    res.status(200).json({success: true , employe});
});

exports.readOneJobs = catchAsyncErrors(async (req, res, next) => {
    const internship = await internshipModel.findById(req.params.id).exec();
    res.status(200).json({success: true , internship});
});

