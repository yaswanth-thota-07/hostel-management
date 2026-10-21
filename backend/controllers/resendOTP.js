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

        const { delivered } = await sendOTPEmail(email, newOTP);

        const isProduction = process.env.NODE_ENV === "production";

        res.status(200).json({
            message: delivered
                ? "New OTP sent to your college email"
                : "New OTP generated — email couldn't be delivered, check the server console",
            ...(delivered ? {} : { delivered: false }),
            ...(isProduction ? {} : { devOtp: newOTP })
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