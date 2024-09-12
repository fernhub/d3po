import { HttpError } from "shared/exceptions/HttpError";
import { type UserInfo } from "shared/schema/user";

export const API_URL = import.meta.env.DEV
  ? "http://localhost:5001"
  : "https://d3po-api.onrender.com";
console.log(API_URL);

export const api = {
  handleLogin: async (email: string, password: string): Promise<UserInfo> => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return checkResponseAndThrowError(res);
  },
  handleSignup: async (name: string, email: string, password: string): Promise<UserInfo> => {
    const res = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
      }),
    });
    return checkResponseAndThrowError(res);
  },
  getCurrentUser: async (): Promise<UserInfo> => {
    const res = await fetch(`${API_URL}/users/me`, {
      credentials: "include",
    });
    return checkResponseAndThrowError(res);
  },
  handleLogout: async (): Promise<void> => {
    const res = await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    checkResponseAndThrowError(res);
  },
  checkResponseAndThrowError,
};

async function checkResponseAndThrowError(res: Response) {
  const json = await res.json();
  if (!res.ok) {
    throw new HttpError({
      message: json.message,
      code: res.status,
    });
  }
  return json;
}
