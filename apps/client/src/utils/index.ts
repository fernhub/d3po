type QueryResponse = {
  answer: string;
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
    return res.json();
  },
};
