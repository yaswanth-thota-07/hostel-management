const nodemailer = require("nodemailer");
const { Resend } = require("resend");

/**
 * Creates a Nodemailer transporter if SMTP or Gmail credentials are provided in .env
 */
const getTransporter = () => {
    const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

    if (user && pass) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: user.trim(),
                pass: pass.replace(/\s+/g, "")
            }
        });
    }

    if (process.env.SMTP_HOST && (process.env.SMTP_USER || user) && (process.env.SMTP_PASS || pass)) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: (process.env.SMTP_USER || user).trim(),
                pass: (process.env.SMTP_PASS || pass).replace(/\s+/g, "")
            }
        });
    }

    return null;
};

/**
 * Sends OTP verification email via Nodemailer or Resend.
 * Falls back gracefully to console logging so local signup/testing is never blocked.
 */
const sendOTPEmail = async (email, otp) => {
    // Always print OTP prominently in the backend console for developer visibility
    console.log("\n=======================================================");
    console.log(`[OTP VERIFICATION] Recipient: ${email}`);
    console.log(`[OTP VERIFICATION] Generated Code: ${otp}`);
    console.log("=======================================================\n");

    const transporter = getTransporter();

    // 1. Try sending via Nodemailer (Gmail / custom SMTP) if configured
    if (transporter) {
        try {
            const sender = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.GMAIL_USER || '"Hostel Management" <no-reply@hostelmanagement.edu>';
            await transporter.sendMail({
                from: sender,
                to: email,
                subject: "Email Verification OTP - Hostel Management",
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                        <h2 style="color: #4f46e5; margin-top: 0; font-size: 20px;">Hostel Management Portal</h2>
                        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Use the following One-Time Password (OTP) to complete your student registration:</p>
                        <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1e293b; background: #f1f5f9; padding: 16px 24px; text-align: center; border-radius: 8px; margin: 24px 0;">
                            ${otp}
                        </div>
                        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">This code will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
                    </div>
                `
            });
            console.log(`[Email Service] Successfully sent OTP email via SMTP to: ${email}`);
            return { delivered: true };
        } catch (smtpErr) {
            console.error(`[Email Service] SMTP sending failed:`, smtpErr.message);
        }
    }

    // 2. Try sending via Resend API
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const response = await resend.emails.send({
                from: process.env.RESEND_FROM || "onboarding@resend.dev",
                to: email,
                subject: "Email Verification OTP",
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`
            });

            if (response.error) {
                throw response.error;
            }

            console.log(`[Email Service] Successfully sent OTP email via Resend to: ${email}`);
            return { delivered: true };
        } catch (resendErr) {
            console.warn(`\n[Resend Warning]: ${resendErr.message || resendErr}`);
            console.warn(`[Resend Notice]: Free test accounts can only send to the account owner. For all recipients, add EMAIL_USER & EMAIL_PASS to backend/.env\n`);
            return {
                delivered: false,
                reason: resendErr.message || "Resend test domain limitation",
                otp
            };
        }
    }

    // 3. Fallback when no provider is active
    return {
        delivered: false,
        reason: "No email provider configured. OTP logged to console.",
        otp
    };
};

module.exports = sendOTPEmail;