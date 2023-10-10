const express = require("express");

const router = express.Router();


// use of controller to add modularity:
const {homeController, studentSignup, studentSignin, studentSignout, currentUser, passwordResetLinkMailStudent, studentForgotLink, studentPasswordReset, updatedStudent, uploadImageStudent, applyIntership, studentSignTemp, allJobs, allInterships, applyJob} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/isAuth");

// home routes - Get
router.post("/", homeController );

// currentUser - Get
router.get("/student", isAuthenticated, currentUser );

// student/signup - POST
router.post("/student/signup", studentSignup);

// student/signin - POST
router.post("/student/signin", studentSignin);

// student/signout - get
router.get("/student/signout",isAuthenticated, studentSignout);

// student/send-mail - post
router.post("/student/send-mail", passwordResetLinkMailStudent);

// student/forgot-pasword/65185cc85b414aa7c3d5e697
router.post("/student/forgot-password", studentForgotLink);


// student/reset-password/65185cc85b414aa7c3d5e697
router.post("/student/reset-password/", isAuthenticated, studentPasswordReset);


// student/update/65185cc85b414aa7c3d5e697
router.post("/student/update/:id", isAuthenticated, updatedStudent);

// student/avatar/65185cc85b414aa7c3d5e697
router.post("/student/avatar/:id", isAuthenticated, uploadImageStudent);


// -------------------------------------------- Internship Apply -------------------------------------

// /student/apply/internship/:internshipid
router.post("/student/apply/internship/:internshipid", isAuthenticated, applyIntership );

// -------------------------------------------- Job Apply -------------------------------------

// /student/apply/job/:jobid
router.post("/student/apply/job/:jobid", isAuthenticated, applyJob);


// -------------------------------------------- Read All internship -------------------------------------

// /student/all/internships/
router.get("/student/all/internships", isAuthenticated, allInterships );


// -------------------------------------------- Read All job -------------------------------------

// /student/all/jobs/
router.get("/student/all/jobs",isAuthenticated, allJobs );



module.exports = router; 