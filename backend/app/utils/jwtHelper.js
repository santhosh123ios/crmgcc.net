// utils/jwtHelper.js
import Jwt from "jsonwebtoken";

/**
 * Verifies a JWT token asynchronously using a Promise wrapper.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key to verify the token against.
 * @returns {Promise<Object>} - A Promise that resolves with the decoded payload.
 */
export const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    Jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err); // Pass the error to catch block
      } else {
        resolve(decoded); // Return decoded token payload
      }
    });
  });
};