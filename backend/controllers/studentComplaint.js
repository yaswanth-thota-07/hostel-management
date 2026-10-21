const Complaint = require("../models/StudentComplaint");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const createComplaint = async (req, res) => {
    try {
        const {
            hostel,
            wing,
            roomNo,
            category,
            description
        } = req.body;

        if (!hostel || !wing || !roomNo || !category || !description) {
            return res.status(400).json({
                message: "All complaint fields are required"
            });
        }

        let imageUrls = [];

        if (req.files && req.files.length) {
            imageUrls = await Promise.all(
                req.files.map((file) =>
                    new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: "hostel-complaints"
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result.secure_url);
                                }
                            }
                        );

                        streamifier.createReadStream(file.buffer)
                            .pipe(uploadStream);
                    })
                )
            );
        }

        const complaint = await Complaint.create({
            student: req.studentId,
            hostel,
            wing,
            roomNo,
            category,
            description,
            image: imageUrls[0] || null,
            images: imageUrls
        });

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        console.error("Create complaint error:", error);

        res.status(500).json({
            message: "Failed to create complaint"
        });
    }
};

const getPendingComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            student: req.studentId,
            status: "pending"
        }).sort({ createdAt: -1 });

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

const getCompletedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            student: req.studentId,
            status: "completed"
        }).sort({ resolvedAt: -1 });

        res.status(200).json({
            complaints
        });

    } catch (error) {
        console.error("Get completed complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch completed complaints"
        });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            student: req.studentId
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        if (complaint.status !== "pending") {
            return res.status(400).json({
                message: "Only pending complaints can be cancelled"
            });
        }

        await Complaint.deleteOne({
            _id: complaint._id
        });

        res.status(200).json({
            message: "Complaint cancelled successfully"
        });

    } catch (error) {
        console.error("Delete complaint error:", error);

        res.status(500).json({
            message: "Failed to cancel complaint"
        });
    }
};

module.exports = {
    createComplaint,
    getPendingComplaints,
    getCompletedComplaints,
    deleteComplaint
};
