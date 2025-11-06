// utils/email.js
const nodemailer = require('nodemailer'); // Correct import

// ✅ FIXED: use createTransport, not createTransporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send verification email
async function sendVerificationEmail(userEmail, verificationToken) {
  const verificationUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Verify Your Email Address',
    text: `Please click the following link to verify your email: ${verificationUrl}`,
    html: `<p>Please click the following link to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error; // Allow route to catch and handle this
  }
}

module.exports = { sendVerificationEmail };
