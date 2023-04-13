import { pool } from "./pool";

export const register = async (
  email: string,
  password: string
): Promise<number | null> => {
  try {
    // Check if user already exists
    const checkQuery = {
      text: "SELECT id FROM users WHERE email = $1",
      values: [email],
    };
    const checkResult = await pool.query(checkQuery);
    if (checkResult.rows.length > 0) {
      return null;
    }

    // Insert new user
    const insertQuery = {
      text: "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      values: [email, password],
    };
    const insertResult = await pool.query(insertQuery);
    return insertResult.rows[0].id;
  } catch (error) {
    console.error("Error while registering user:", error);
    throw error;
  }
};
