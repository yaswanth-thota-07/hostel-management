const SubAdmin = require("../models/SubAdmin");

const getAllSubAdmins = async (req, res) => {
    try {
        const subAdmins = await SubAdmin.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            subAdmins
        });

    } catch (error) {
        console.error("Get SubAdmins error:", error);

        res.status(500).json({
            message: "Failed to fetch SubAdmins"
        });
    }
};

const deleteSubAdmin = async (req, res) => {
    try {
        const subAdmin = await SubAdmin.findById(req.params.id);

        if (!subAdmin) {
            return res.status(404).json({
                message: "SubAdmin not found"
            });
        }

        await SubAdmin.deleteOne({
            _id: req.params.id
        });

        res.status(200).json({
            message: "SubAdmin removed successfully"
        });

    } catch (error) {
        console.error("Delete SubAdmin error:", error);

        res.status(500).json({
            message: "Failed to remove SubAdmin"
        });
    }
};

module.exports = {
    deleteSubAdmin,
    getAllSubAdmins
};