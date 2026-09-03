const Student = require("../models/Student");

const signup = async (req, res) => {
    try {
        const { name, email, regNo, phone, password, confirmPassword } = req.body;

        if (!name || !email || !regNo || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!email.endsWith("@aitpune.edu.in")) {
            return res.status(400).json({
                message: "Use your college email"
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit phone number"
            });
        }

        if (!/^[A-Za-z0-9]+$/.test(regNo)) {
            return res.status(400).json({
                message: "Enter a valid registration number"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const existingStudent = await Student.findOne({
            $or: [{ email }, { regNo }]
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Email or registration number already exists"
            });
        }

        await Student.create({
            name,
            email,
            regNo,
            phone,
            password
        });

        res.status(201).json({
            message: "Student account created"
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    signup
};