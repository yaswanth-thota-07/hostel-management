const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (!email.endsWith("@aitpune.edu.in")) {
            return res.status(400).json({
                message: "Use your college email"
            });
        }

        const student = await Student.findOne({ email });

        if (!student || password !== student.password) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
          {
                id: student._id,
                role: "student"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    login
};