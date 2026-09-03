const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const { createSubAdmin } = require("../controllers/subAdminSignin");
const { login } = require("../controllers/adminLogin");
const { deleteSubAdmin, getAllSubAdmins } = require("../controllers/subAdminManagement");

const {
    getTodayComplaints,
    getPendingComplaints,
    getCompletedComplaints,
    completeComplaint
} = require("../controllers/staffComplaint");

const router = express.Router();

router.post("/login", login);

router.post(
    "/create-subadmin",
    adminMiddleware,
    createSubAdmin
);

router.get(
    "/complaints/today",
    adminMiddleware,
    getTodayComplaints
);

router.get(
    "/complaints/pending",
    adminMiddleware,
    getPendingComplaints
);

router.get(
    "/complaints/completed",
    adminMiddleware,
    getCompletedComplaints
);

router.patch(
    "/complaints/:id/complete",
    adminMiddleware,
    completeComplaint
);

router.delete(
    "/delete-subadmin/:id",
    adminMiddleware,
    deleteSubAdmin
);

router.get(
    "/subadmins",
    adminMiddleware,
    getAllSubAdmins
);

module.exports = router;