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
        new: true
    }
);
        const { delivered } = await sendOTPEmail(email, otp);

        const isProduction = process.env.NODE_ENV === "production";

        res.status(200).json({
            message: delivered
                ? "OTP sent to your college email"
                : "OTP generated — email couldn't be delivered, check the server console",
            ...(delivered ? {} : { delivered: false }),
            ...(isProduction ? {} : { devOtp: otp })
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