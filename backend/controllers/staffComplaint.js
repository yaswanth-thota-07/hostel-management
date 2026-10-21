const Complaint = require("../models/StudentComplaint");
const Admin = require("../models/Admin.js");
const SubAdmin = require("../models/SubAdmin");

const getTodayComplaints = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const complaints = await Complaint.find({
            createdAt: {
                $gte: startOfToday,
                $lte: endOfToday
            }
        })
        .populate("student", "name email regNo phone")
        .sort({ createdAt: -1 });

        res.status(200).json({
            complaints
        });

    } catch (error) {
        console.error("Get today's complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch today's complaints"
        });
    }
};

const getPendingComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            status: "pending"
        })
        .populate("student", "name email regNo phone")
        .sort({ createdAt: -1 });

        res.status(200).json({
            complaints
        });

    } catch (error) {
        console.error("Get pending complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch pending complaints"
        });
    }
};

const completeComplaint = async (req, res) => {
    try {
        const { resolutionNote } = req.body;

       
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        if (complaint.status !== "pending") {
            return res.status(400).json({
                message: "Only pending complaints can be completed"
            });
        }

        complaint.status = "completed";
        if (resolutionNote) {
            complaint.resolutionNote = resolutionNote.trim();
        }
        complaint.resolvedAt = new Date();

        if (req.adminId) {
            complaint.resolvedBy = req.adminId;
            complaint.resolvedByModel = "Admin";
        }

        if (req.subAdminId) {
            complaint.resolvedBy = req.subAdminId;
            complaint.resolvedByModel = "SubAdmin";
        }

        await complaint.save();

        res.status(200).json({
            message: "Complaint completed successfully",
            complaint
        });

    } catch (error) {
        console.error("Complete complaint error:", error);

        res.status(500).json({
            message: "Failed to complete complaint"
        });
    }
};

const getCompletedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            status: "completed"
        })
        .populate("student", "name email regNo phone")
        .sort({ resolvedAt: -1 });

        const result = [];

        for (const complaint of complaints) {

            let solvedBy = null;

            if (complaint.resolvedByModel === "Admin") {
                solvedBy = await Admin.findById(complaint.resolvedBy)
                    .select("email");
            }

            if (complaint.resolvedByModel === "SubAdmin") {
                solvedBy = await SubAdmin.findById(complaint.resolvedBy)
                    .select("staffName staffEmail staffRegId staffMobile");
            }

            result.push({
                complaint,
                solvedBy
            });
        }

        res.status(200).json({
            complaints: result
        });

    } catch (error) {
        console.error("Get completed complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch completed complaints"
        });
    }
};

module.exports = {
    getTodayComplaints,
    getPendingComplaints,
    getCompletedComplaints,
    completeComplaint
};
   