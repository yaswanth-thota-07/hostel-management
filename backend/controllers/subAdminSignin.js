const SubAdmin = require("../models/SubAdmin");

const createSubAdmin = async (req, res) => {
    try {
        const {
            staffName,
            staffMobile,
            staffRegId,
            staffEmail,
            password,
            confirmPassword
        } = req.body;

        if (!staffName || !staffMobile || !staffRegId || !staffEmail || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const existingSubAdmin = await SubAdmin.findOne({
            $or: [
                { staffEmail },
                { staffRegId }
            ]
        });

        if (existingSubAdmin) {
            return res.status(400).json({
                message: "Staff email or registration ID already exists"
            });
        }

        await SubAdmin.create({
            staffName,
            staffMobile,
            staffRegId,
            staffEmail,
            password
        });

        res.status(201).json({
            message: "Sub-admin created successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    createSubAdmin
};