const express = require("express");
const {signup} = require("../controllers/studentSignin");
const {login} = require("../controllers/studentLogin");
const authMiddleware = require("../middleware/studentAuthMid");
const { getProfile } = require("../controllers/studentProfile");


const router = express.Router();



router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;