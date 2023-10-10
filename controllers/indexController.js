// exports.homeController = (req, res,next)=>{
//     res.json({msg: "home route"});
// }

const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const internshipModel = require("../models/intership");
const jobModel = require("../models/jobs");
const studentModel = require("../models/student");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendToken } = require("../utils/SendToken");
const { sendMail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imagekit").initImagekit();


exports.homeController = catchAsyncErrors(async (req, res, next) => {
    res.json({ msg: "home route secured Route", data: req.body });
});


exports.currentUser = catchAsyncErrors(async (req, res, next) => {
    const student = await studentModel.findById(req.id).populate("interships").populate("jobs").exec();
    res.json(student);
});

exports.studentSignup = catchAsyncErrors(async (req, res, next) => {

        const isstudent = await studentModel.findOne({email: req.body.email}).exec();
        if(isstudent){
            res.json({msg: "Student Already Exits"});
        }
        const student = await new studentModel(req.body).save();
        sendToken(student, 201, res);

});



exports.studentSignin = catchAsyncErrors(async (req, res, next) => {
    const student = await studentModel.findOne({ email: req.body.email }).select("+password").exec();

    if (!student) return (next(new ErrorHandler("This Email don't Exist", 404)));


    const isMatch = student.comparePassword(req.body.password);

    if (!isMatch) return (next(new ErrorHandler("Wrong Password", 500)));

    // res.json(student);
    sendToken(student, 201, res);

});


exports.studentSignout = catchAsyncErrors(async (req, res, next) => {


    res.clearCookie("token");
    res.json({ message: "SignOut SuccessFully" });


});


// send mail
exports.passwordResetLinkMailStudent = catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findOne({ email: req.body.email }).exec();

    if (!student) return (next(new ErrorHandler("This Email don't Exist", 404)));

    const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

    student.resetPasswordToken = `${otp}`;

    sendMail(req, res, next, otp);

    student.save();
    res.status(200).json({
        student, otp
    });
});

exports.studentForgotLink = catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findOne({email:req.body.email}).exec();

    if (!student) return (next(new ErrorHandler("This Email don't Exist", 404)));


    if (student.resetPasswordToken == req.body.otp) {
        student.resetPasswordToken = "0000";
        student.password = req.body.password;
        await student.save();
        res.status(200).json({ msg: "Password Change Sucessully" });
    }

    else {
        return next(new ErrorHandler("Otp Is Invalid", 500))
    }


});

exports.studentPasswordReset = catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findById(req.id).exec();
    if (!student) return (next(new ErrorHandler("This Email don't Exist", 404)));

    student.password = req.body.password;
    student.save();
    res.status(200).json({ msg: "Password Change Sucessully!" });

});

exports.updatedStudent =  catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findByIdAndUpdate(req.id, req.body);
    student.save();
    res.status(200).json({success: true, msg: "Student Updated Sucessully" , student});

});



exports.uploadImageStudent =  catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findByIdAndUpdate(req.id, req.body).exec();
    const file = req.files.avatar;
    const updatedFileName = `resume-upload-avatar-${Date.now()}-${file.name}-${path.extname(file.name)}`;
    if(student.avatar.fileId !== ""){
        await imagekit.deleteFile(student.avatar.fileId);
    }
    const {fileId, url} = await imagekit.upload({file: file.data, fileName: updatedFileName});
    student.avatar = {fileId, url}
    student.save();
    res.status(200).json({
        success: true,
        message: "Image uploaded successfully"
    });

});

// -------------------------------------------- Internship Apply -------------------------------------


exports.applyIntership = catchAsyncErrors(async (req, res, next) => {
    const student = await studentModel.findById(req.id).exec();
    const internship = await internshipModel.findById(req.params.internshipid).exec();

    student.interships.push(internship._id);
    internship.students.push(student._id);

    student.save();
    internship.save();

    res.status(200).json({student, internship});
});

// -------------------------------------------- Job Apply -------------------------------------

exports.applyJob = catchAsyncErrors(async (req, res, next) => {
    const student = await studentModel.findById(req.id).exec();
    const job = await jobModel.findById(req.params.jobid).exec();

    student.interships.push(job._id);
    job.students.push(student._id);

    student.save();
    job.save();

    res.status(200).json({student, job});
});

// -------------------------------------------- Read All Internship -------------------------------------

exports.allInterships = catchAsyncErrors(async (req, res, next) => {
    const allintenship = await internshipModel.find().populate("employe").exec();

    res.status(200).json({allintenship});
});

// -------------------------------------------- Read All job -------------------------------------

exports.allJobs = catchAsyncErrors(async (req, res, next) => {
    const alljobs = await jobModel.find().populate("employe").exec();

    res.status(200).json({alljobs});
});