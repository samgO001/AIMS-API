const crypto = require('crypto');

/**
 * Generates a secure random unhashed token (hex string) and its SHA-256 hash.
 * Storing the hash in DB prevents token leakage if DB is compromised (OWASP recommendation).
 */
const generateRandomToken = () => {
  const unhashedToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');
  return { unhashedToken, hashedToken };
};

/**
 * Hashes a given unhashed token using SHA-256 for lookup comparison.
 */
const hashToken = (unhashedToken) => {
  return crypto.createHash('sha256').update(unhashedToken).digest('hex');
};

module.exports = {
  generateRandomToken,
  hashToken,
};
