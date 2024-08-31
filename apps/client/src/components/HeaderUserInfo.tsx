import LoginOrSignupUserHeader from "./LoginOrSignupUserHeader";
import AuthenticatedUserHeader from "./AuthenticatedUserHeader";
import { useAuth } from "../context/AuthContext";

export default function HeaderUserInfo() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AuthenticatedUserHeader /> : <LoginOrSignupUserHeader />;
}
