const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const studentModel = require("../models/student");
const ErrorHandler = require("../utils/ErrorHandler");

const { v4: uuidv4 } = require("uuid");


exports.resume = catchAsyncErrors(async (req, res, next) => {

    const { resume } = await studentModel.findById(req.id).exec();
    res.json({ resume });
});


exports.addEducation = catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findById(req.id).exec();

    student.resume.education.push({ ...req.body, id: uuidv4() });
    student.save();
    res.json({ message: "Education Added!", resume: student.resume });
});


exports.editEducation = catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findById(req.id).exec();

    const eduIndex = student.resume.education.findIndex((elem) => elem.id === req.params.eduid);
    console
    student.resume.education[eduIndex] = { ...student.resume.education[eduIndex], ...req.body };

    student.save();
    res.json({ message: "Education Updated!", resume: student.resume });
});

exports.deleteEducation = catchAsyncErrors(async (req, res, next) => {

    const student = await studentModel.findById(req.id).exec();

    const FiltedEducation = student.resume.education.filter((elem) => elem.id !== req.params.eduid);
    student.resume.education = FiltedEducation;
    student.save();
    res.json({ message: "Education Deleted!", resume: student.resume });
});