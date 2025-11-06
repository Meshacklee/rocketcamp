// utils/authUtils.js
const crypto = require('crypto');

// Generate email confirmation token
exports.generateEmailConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return {
    token,
    hashedToken,
    expires
  };
};

// Generate password reset token
exports.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return {
    resetToken,
    hashedToken,
    expires
  };
};