import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "",
    { expiresIn: "1h" }
  );
};

const signup = async (
  email: string,
  username: string,
  password: string
): Promise<IUser> => {
  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("User with this email or username already exists");
  }

  // Hash the password and create a new user
  const hashedPassword = await hashPassword(password);

  const user = new User({
    email,
    username,
    password: hashedPassword,
  });

  return await user.save();
};

const login = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

export default {
  hashPassword,
  comparePassword,
  generateToken,
  signup,
  login,
};
