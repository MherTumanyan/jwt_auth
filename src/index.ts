import { login } from "./db";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

import { register } from "./db";
import { generateToken } from "./helper";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Login endpoint
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user);

    return res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Registration endpoint
app.post("/register", async (req: Request, res: Response) => {
  const { password, email } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user already exists
    const userId = await register(email, hashedPassword);
    if (userId === null) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate token
    const token = generateToken({ id: userId, email });
    return res.json({ token });
  } catch (error) {
    console.error("Error while registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
