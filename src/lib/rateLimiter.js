/**
 * @fileoverview This file provides a simple in-memory rate limiter.
 * It's a basic implementation and might not be suitable for a large-scale production environment,
 * but it's a good first step to prevent brute-force attacks.
 */

const attempts = new Map();

/**
 * Checks if a given key (e.g., an IP address or username) has exceeded the rate limit.
 * @param {string} key - The key to check.
 * @param {number} maxAttempts - The maximum number of attempts allowed within the window.
 * @param {number} windowMs - The time window in milliseconds.
 * @returns {boolean} - True if the key is rate-limited, false otherwise.
 */
export const isRateLimited = (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get the attempts for this key, filtering out old ones.
  const userAttempts = (attempts.get(key) || []).filter(timestamp => timestamp > windowStart);

  if (userAttempts.length >= maxAttempts) {
    // If the user has made too many attempts, they are rate-limited.
    return true;
  }

  // Record the new attempt.
  userAttempts.push(now);
  attempts.set(key, userAttempts);

  return false;
};
