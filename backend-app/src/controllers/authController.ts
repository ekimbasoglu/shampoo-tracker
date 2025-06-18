import { Request, Response } from "express";
import authService from "../services/authService";
import { IUser } from "../models/userModel";

const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password } = req.body;

  try {
    const user: IUser = await authService.signup(email, username, password);
    const token = authService.generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await authService.login(email, password);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = authService.generateToken(user);

    res.status(200).json({
      message: "Logged in successfully",
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }
    res.status(500).json({ message: error.message });
  }
};

export default {
  signup,
  login,
};
