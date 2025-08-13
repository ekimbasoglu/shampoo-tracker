import { User } from "../models/userModel";

export type Env = {
  Bindings: {
    DB: D1Database;
  };

  Variables: {
    user: User;
  };
};
