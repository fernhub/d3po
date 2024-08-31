import { UserInfo } from "shared/schema/user";

export type AuthContextData = {
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};
