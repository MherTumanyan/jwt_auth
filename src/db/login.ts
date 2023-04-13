// Import pool
import { pool } from "./pool";
// Imort password checker function
import { comparePassword } from "../helper";

/**
 * Function to log in a user
 * @param email - Email address of user
 * @param password - Plain text password of user
 * @returns A Promise that resolves to either false or a User object
 */

export const login = async (
  email: string,
  password: string
): Promise<boolean | User> => {
  // Create SQL query to find user by email
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };
  try {
    // Execute query and get rows from result
    const { rows } = await pool.query(query);
    // If no rows were returned, return false
    if (!rows[0]) {
      return false;
    }
    // Check if the provided password matches the stored hashed password
    const isValidPass = await comparePassword(password, rows[0].password);
    // If password doesn't match, return false
    if (!isValidPass) {
      return false;
    }
    // Return the user object if everything is successful
    return rows[0];
  } catch (error) {
    console.error("Error while logging in:", error);
    throw error;
  }
};
