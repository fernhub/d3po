import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContextData } from "./types";
import { api } from "../utils";
import { UserInfo } from "shared/schema/user";
import { HttpError } from "shared/exceptions/HttpError";
import { appStateAtom } from "../state/app";
import { useAtom } from "jotai";

const AuthContext = createContext<AuthContextData>({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [, setAppState] = useAtom(appStateAtom);

  useEffect(() => {
    async function fetchUserState() {
      console.log("fetching current user");
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
          setAppState("loading");
        } else {
          setAppState("unauthenticated");
          console.log("no user found");
        }
      } catch (e) {
        setAppState("unauthenticated");
        if (e instanceof HttpError) {
          console.log("no current user session");
        } else {
          console.log(e);
        }
      }
    }

    fetchUserState();
  }, [setAppState]);

  async function login(email: string, password: string) {
    const res = await api.handleLogin(email, password);
    console.log("setting user");
    console.log(res);
    setUser(res);
    setIsLoggedIn(true);
  }

  async function logout() {
    await api.handleLogout();
    setUser(null);
    setIsLoggedIn(false);
  }

  async function signup(name: string, email: string, password: string) {
    const res = await api.handleSignup(name, email, password);
    console.log("setting user");
    console.log(res);
    setUser(res);
    setIsLoggedIn(true);
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        user,
        isLoggedIn,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("AuthContext is used outside of AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
