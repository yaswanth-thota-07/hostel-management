const express = require("express");
const { login } = require("../controllers/subAdminLogin");
const subAdminMiddleware = require("../middleware/subAdminMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/dashboard", subAdminMiddleware, (req, res) => {
    res.json({
        message: "Sub-admin dashboard route working",
        subAdminId: req.subAdminId 
    });
});

module.exports = router;