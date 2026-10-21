const express = require("express");
const {signup} = require("../controllers/studentSignin");
const {login} = require("../controllers/studentLogin");
const authMiddleware = require("../middleware/studentAuthMid");
const { getProfile } = require("../controllers/studentProfile");
const { verifyOTP } = require("../controllers/verifyStudentOTP");
const { resendOTP } = require("../controllers/resendOTP");


const router = express.Router();



router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;