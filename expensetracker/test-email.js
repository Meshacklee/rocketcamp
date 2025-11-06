import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded ENV:", process.env.EMAIL, process.env.EMAIL_PASS ? "Password exists" : "No password");

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL}>`,
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email from Expense Tracker!",
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("📧 Email error details:", error);
    console.error("❌ Test email failed:", error.message);
  }
}

sendTestEmail();
