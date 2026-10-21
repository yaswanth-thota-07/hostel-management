const express = require("express");
const router = express.Router();

const { createComplaint,getPendingComplaints,getCompletedComplaints, deleteComplaint } = require("../controllers/studentComplaint.js");
const authMiddleware = require("../middleware/studentAuthMid.js");
const upload = require("../middleware/upload");

router.post(
    "/create",
    authMiddleware,
    upload.array("images", 5),
    createComplaint
);

router.get(
    "/pending",
    authMiddleware,
    getPendingComplaints
);

router.get(
    "/completed",
    authMiddleware,
    getCompletedComplaints
);

router.delete(
    "/:id",
    authMiddleware,
    deleteComplaint
);

module.exports = router;