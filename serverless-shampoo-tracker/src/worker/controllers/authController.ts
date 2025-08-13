import { Context } from "hono";
import authService from "../services/authService";

export const signup = async (c: Context) => {
  const { email, username, password } = await c.req.json();

  try {
    const user = await authService.signup(c.env.DB, email, username, password);
    const token = await authService.generateToken(user);

    return c.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      },
      201
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return c.json({ message }, 500);
  }
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();

  try {
    const user = await authService.login(c.env.DB, email, password);

    if (!user) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const token = await authService.generateToken(user);

    return c.json(
      {
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      },
      200
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      return c.json({ message: "Invalid credentials" }, 401);
    }
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return c.json({ message }, 500);
  }
};

export default {
  signup,
  login,
};
