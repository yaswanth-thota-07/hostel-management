const OTP = require("../models/OTP");
const sendOTPEmail = require("../utils/sendEmail");

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const otpData = await OTP.findOne({ email });

        if (!otpData) {
            return res.status(400).json({
                message: "Registration not found or OTP expired"
            });
        }

        
        const timePassed = Date.now() - otpData.createdAt;

        if (timePassed < 2 * 60 * 1000) {
            const remainingTime = Math.ceil(
                (2 * 60 * 1000 - timePassed) / 1000
            );

            return res.status(429).json({
                message: `Please wait ${remainingTime} seconds before requesting a new OTP`
            });
        }

        const newOTP = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        otpData.otp = newOTP;
        otpData.expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await otpData.save();

        const emailResult = await sendOTPEmail(email, newOTP);

        if (!emailResult.delivered) {
            return res.status(500).json({
                message: emailResult.reason || "Failed to send verification email. Please check your email configuration in backend/.env."
            });
        }

        res.status(200).json({
            message: "New OTP sent to your email"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    resendOTP
};