const { Resend } = require("resend");

let resend = null;
const getResend = () => {
    if (!resend && process.env.RESEND_API_KEY) {
        try {
            resend = new Resend(process.env.RESEND_API_KEY);
        } catch (e) {
            console.warn("[Hoste] Failed to initialize Resend:", e.message);
        }
    }
    return resend;
};

const sendOTPEmail = async (email, otp) => {
    console.log(`[Hoste] OTP for ${email}: ${otp}  (mail may not deliver in sandbox mode)`);

    const client = getResend();
    if (!client) {
        console.warn("[Hoste] RESEND_API_KEY not configured. OTP printed to server logs.");
        return { delivered: false, reason: "RESEND_API_KEY is not configured" };
    }

    try {
        const result = await client.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Email Verification OTP",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`
        });

        if (result && result.error) {
            console.warn("[Hoste] Resend could not deliver the email:", result.error.message);
            return { delivered: false, reason: result.error.message };
        }

        return { delivered: true };
    } catch (error) {
        console.warn("[Hoste] Resend email failed:", error.message);
        return { delivered: false, reason: error.message };
    }
};

module.exports = sendOTPEmail;