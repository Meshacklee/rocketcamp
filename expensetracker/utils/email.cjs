// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  try {
    // Correct way to create the transporter with the require'd nodemailer
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, '') // Remove any spaces just in case
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('📧 Email error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};

module.exports = sendEmail;