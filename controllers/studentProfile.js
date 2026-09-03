const Student = require("../models/Student");

const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.studentId).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    getProfile
};