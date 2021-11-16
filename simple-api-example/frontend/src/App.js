import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [state, setstate] = useState();

  const handleS = async () => {
    await fetch(
      "https://mpsenrwvm8.execute-api.ap-south-1.amazonaws.com/prod/branches",
      {
        method: "GET",
        headers: {
          "x-api-key": "8LAtCcntt52bKwcCWiQpq3n7xZXSnBkEnX5TTkJb",
        },
      }
    )
      .then(async (res) => {
        const data = await res.json();
        setstate(data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="App">
      <button onClick={handleS}>Click Me</button>
      <h1>Results: {state}</h1>
    </div>
  );
}

export default App;
