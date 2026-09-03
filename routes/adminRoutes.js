const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const { createSubAdmin } = require("../controllers/subAdminSignin");
const { login } = require("../controllers/adminLogin");

const router = express.Router();

router.post("/login", login);
router.post("/create-subadmin", adminMiddleware, createSubAdmin);

module.exports = router;