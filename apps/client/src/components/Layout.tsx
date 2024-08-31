import { useAuth } from "../context/AuthContext";
import AuthLayout from "./AuthLayout";
import UnauthLayout from "./UnauthLayout";

export default function Layout() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AuthLayout /> : <UnauthLayout />;
}
