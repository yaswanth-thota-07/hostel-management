const Student = require("../models/Student");
const OTP = require("../models/OTP");
const sendOTPEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            regNo,
            phone,
            password,
            confirmPassword
        } = req.body;

        if (!name || !email || !regNo || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Enter a valid email address"
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.findOneAndUpdate(
            { email },
            {
                name,
                email,
                regNo,
                phone,
                password,
                otp,
                expiresAt,
                createdAt: new Date()
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        const emailResult = await sendOTPEmail(email, otp);

        if (!emailResult.delivered) {
            return res.status(500).json({
                message: emailResult.reason || "Failed to send verification email to your address. Please contact the administrator or check email settings in backend/.env."
            });
        }

        res.status(200).json({
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    signup
};