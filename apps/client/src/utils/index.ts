import { HttpError } from "shared/exceptions/HttpError";

type QueryResponse = {
  msg: string;
};

export const api = {
  queryRag: async (queryString: string): Promise<QueryResponse> => {
    const res = await fetch("http://localhost:5001/pdfs/query", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: queryString,
      }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new HttpError({
        message: json.answer,
        code: res.status,
      });
    }
    return checkResponseAndThrowError(res);
  },
  handleLogin: async (email: string, password: string): Promise<QueryResponse> => {
    const res = await fetch("http://localhost:5001/users/login", {
      method: "POST",
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
  handleSignup: async (email: string, name: string, password: string): Promise<QueryResponse> => {
    const res = await fetch("http://localhost:5001/users/login", {
      method: "POST",
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
};

async function checkResponseAndThrowError(res: Response) {
  const json = await res.json();
  console.log(json);
  if (!res.ok) {
    throw new HttpError({
      message: json.msg,
      code: res.status,
    });
  }
  return json;
}
