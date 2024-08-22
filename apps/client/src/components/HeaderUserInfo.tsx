import LoginOrSignupUserHeader from "./LoginOrSignupUserHeader";
import AuthenticatedUserHeader from "./AuthenticatedUserHeader";

interface HeaderUserInfoProps {
  authenticated: boolean;
}

export default function HeaderUserInfo({ authenticated }: HeaderUserInfoProps) {
  return authenticated ? (
    <AuthenticatedUserHeader userName="Zack Fernandez" />
  ) : (
    <LoginOrSignupUserHeader />
  );
}
