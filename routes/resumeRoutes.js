const express = require("express");
const router = express.Router();


// use of controller to add modularity:
const { isAuthenticated } = require("../middlewares/isAuth");
const { resume, addEducation, editEducation, deleteEducation } = require("../controllers/resumeController");

// resume route - Get
router.get("/", isAuthenticated, resume);

// add education route -Post
router.post("/add-edu", isAuthenticated, addEducation);

// edit education route -Post
router.post("/edit-edu/:eduid", isAuthenticated, editEducation);

// delete education route -Post
router.post("/delete/:eduid", isAuthenticated, deleteEducation);

module.exports = router; 