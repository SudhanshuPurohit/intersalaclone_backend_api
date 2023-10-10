const express = require("express");

const router = express.Router();


// use of controller to add modularity:
const {homeController, employeSignup, employeSignin, employeSignout, currentUser, passwordResetLinkMailemploye, employeForgotLink, employePasswordReset, updatedemploye, uploadImageemploye, createIntership, createjob, readallInternships, readOneInternships, readOneJob, readallJobs, readallInternshipsOfEmploye, createInternship, readallJobsOfEmploye, readOneJobs, createJob, editJob, editInternship} = require("../controllers/employeController");
const { isAuthenticated } = require("../middlewares/isAuth");

// home routes - Get
router.get("/" , homeController );

// currentUser - Get
router.get("/current", isAuthenticated, currentUser );
// 
// employe/signup - POST
router.post("/signup", employeSignup);

// employe/signin - POST
router.post("/signin", employeSignin);

// employe/signout - get
router.get("/signout",isAuthenticated, employeSignout);

//  employe/send-mail - post
router.post("/send-mail", passwordResetLinkMailemploye);

// employe/forgot-pasword/65185cc85b414aa7c3d5e697
router.post("/forgot-password/", employeForgotLink);

// employe/reset-password/65185cc85b414aa7c3d5e697
router.post("/reset-password/:id", isAuthenticated, employePasswordReset);


// employe/update/65185cc85b414aa7c3d5e697
router.post("/update/:id", isAuthenticated, updatedemploye);

// employe/avatar/65185cc85b414aa7c3d5e697
router.post("/avatar/:id", isAuthenticated, uploadImageemploye);



// --------------------------------------Internship create by employe -------------------------------

// /internship/create -Post
router.post("/internship/create", isAuthenticated, createInternship );


// /job/update -Post
router.post("/internship/update/:id", isAuthenticated, editInternship);

// /internship/readall -Get
router.get("/internship/readall", isAuthenticated, readallInternships );

// /internship/read -Get
router.get("/internship/reademploye", isAuthenticated, readallInternshipsOfEmploye);

// /internship/readone/:id -Get
router.get("/internship/readone/:id", isAuthenticated, readOneInternships );


// --------------------------------------job create by employe -------------------------------

// /job/create -Post
router.post("/job/create", isAuthenticated, createJob);

// /job/update -Post
router.post("/job/update/:id", isAuthenticated, editJob);

// /job/readall -Get
router.get("/job/readall", isAuthenticated, readallJobs );

// /job/read -Get
router.get("/job/reademploye", isAuthenticated, readallJobsOfEmploye);

// /internship/readone/:id -Get
router.get("/job/readone/:id", isAuthenticated, readOneJobs );



module.exports = router; 