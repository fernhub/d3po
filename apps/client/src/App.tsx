import { useState } from "react";
import "./App.css";
import { api } from "./api/index";

function App() {
  const args = {
    ragInitialized: false,
    query: "",
    response: "",
  };
  const [data, setData] = useState(args);
  return (
    <>
      <div></div>
      <h1>Load and ask your PDF anything you want</h1>
      <div className="card">
        <button
          onClick={async () => {
            const res = await fetch("http://localhost:5001/pdfs/rag");
            console.log(res);
            setData({ ...data, ragInitialized: true });
          }}>
          Load PDF
        </button>
        <p></p>
        <form
          hidden={!data.ragInitialized}
          onSubmit={async () => {
            event?.preventDefault();
            const value = document.querySelector<HTMLInputElement>("#queryInput")?.value ?? "";
            if (value === "") {
              console.log("error");
            } else {
              const res = await api.queryRag(value);
              console.log(res);
              setData({ ...data, response: res.answer });
            }
          }}>
          <input id="queryInput" type="text" width="200px" />
          <button>Ask your PDF</button>
        </form>
        <p hidden={!data.ragInitialized}>Answer: {data.response} </p>
      </div>
    </>
  );
}

export default App;
