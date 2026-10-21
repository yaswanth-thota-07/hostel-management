const Student = require("../models/Student");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const otpData = await OTP.findOne({ email });

        if (!otpData) {
            return res.status(400).json({
                message: "OTP not found"
            });
        }

        if (otpData.expiresAt < new Date()) {
            await OTP.deleteOne({ email });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        
        const hashedPassword = await bcrypt.hash(otpData.password, 10);

        await Student.create({
            name: otpData.name,
            email: otpData.email,
            regNo: otpData.regNo,
            phone: otpData.phone,
            password: hashedPassword
        });

        
        await OTP.deleteOne({ email });

        res.status(201).json({
            message: "Email verified and account created successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    verifyOTP
};