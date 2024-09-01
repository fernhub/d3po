import { HttpError } from "shared/exceptions/HttpError";
import { type UserInfo } from "shared/schema/user";
type QueryResponse = {
  msg: string;
};

export const api = {
  queryRag: async (queryString: string): Promise<QueryResponse> => {
    const res = await fetch("http://localhost:5001/pdfs/query", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: queryString,
      }),
    });
    return checkResponseAndThrowError(res);
  },
  handleLogin: async (email: string, password: string): Promise<UserInfo> => {
    const res = await fetch("http://localhost:5001/users/login", {
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
    const res = await fetch("http://localhost:5001/users/signup", {
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
    const res = await fetch("http://localhost:5001/users/me", {
      credentials: "include",
    });
    return checkResponseAndThrowError(res);
  },
  handleLogout: async (): Promise<void> => {
    const res = await fetch("http://localhost:5001/users/logout", {
      method: "POST",
      credentials: "include",
    });
    checkResponseAndThrowError(res);
  },
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
