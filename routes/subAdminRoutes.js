const express = require("express");

const { login } = require("../controllers/subAdminLogin");

const subAdminMiddleware = require("../middleware/subAdminMiddleware");

const {
    getTodayComplaints,
    getPendingComplaints,
    getCompletedComplaints,
    completeComplaint
} = require("../controllers/staffComplaint");

const router = express.Router();

router.post("/login", login);

router.get("/dashboard", subAdminMiddleware, (req, res) => {

    res.json({
        message: "Sub-admin dashboard route working",
        subAdminId: req.subAdminId
    });

});

router.get(
    "/complaints/today",
    subAdminMiddleware,
    getTodayComplaints
);

router.get(
    "/complaints/pending",
    subAdminMiddleware,
    getPendingComplaints
);

router.get(
    "/complaints/completed",
    subAdminMiddleware,
    getCompletedComplaints
);

router.patch(
    "/complaints/:id/complete",
    subAdminMiddleware,
    completeComplaint
);


module.exports = router;