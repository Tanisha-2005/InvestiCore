const nodemailer = require("nodemailer");

// Create Transporter (Optimized for Gmail SMTP & custom SMTP servers)
const getTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Gmail Transport Optimization
    if (process.env.SMTP_HOST === "smtp.gmail.com" || process.env.SMTP_SERVICE === "gmail") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    // Generic SMTP Transport
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

exports.sendOTPVerificationEmail = async (toEmail, name, otp) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"InvestiCore Security" <${process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@investicore.gov"}>`,
      to: toEmail,
      subject: "🔒 InvestiCore Platform — Email Verification OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f17; color: #ffffff; padding: 30px; borderRadius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">InvestiCore Security Command</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Cybercrime Threat Intelligence Platform</p>
          </div>
          <div style="background-color: #111827; padding: 25px; border-radius: 8px; border: 1px solid #334155; text-align: center;">
            <h2 style="color: #f3f4f6; font-size: 18px; margin-top: 0;">Personnel Account Verification</h2>
            <p style="color: #cbd5e1; font-size: 14px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #94a3b8; font-size: 14px;">Use the following 6-digit One-Time Password (OTP) to complete your account registration:</p>
            
            <div style="background-color: #1e293b; color: #60a5fa; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 15px 30px; display: inline-block; border-radius: 8px; margin: 20px 0; border: 1px solid #3b82f6;">
              ${otp}
            </div>

            <p style="color: #e2e8f0; font-size: 12px;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #64748b;">
            <p>© 2026 InvestiCore Security. ISO/IEC 27037 Legal Compliance Enforced.</p>
          </div>
        </div>
      `,
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Real OTP Email successfully delivered to inbox: ${toEmail}`);
    } else {
      console.log(`=======================================================`);
      console.log(`[OTP Verification Email] Target Inbox: ${toEmail}`);
      console.log(`[OTP Code]: ${otp}`);
      console.log(`=======================================================`);
    }

    return true;
  } catch (err) {
    console.error(`[Email Service Error] Failed to send OTP email to ${toEmail}: ${err.message}`);
    return false;
  }
};
