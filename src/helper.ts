import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * JWT_SECRET: The secret key used to sign and verify JWT tokens.
 * If the JWT_SECRET environment variable is not set, a default secret key will be used.
 */
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

/**
 * generateToken: Generates a new JWT token with the provided payload and returns it.
 *
 * @param payload The payload to include in the JWT token.
 * @returns The generated JWT token.
 */

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

// Function to compare plain text password with hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (err) {
    console.error(`Error comparing passwords: ${err}`);
    return false;
  }
};
