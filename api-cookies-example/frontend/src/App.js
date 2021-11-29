import React, { useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";

function App() {
  const [state, setstate] = useState();

  const handleS = async () => {
    //   await fetch(
    //     "https://3c461g3x25.execute-api.ap-south-1.amazonaws.com/prod/signup",
    //     {
    //       credentials: "include",
    //       method: "POST",
    //       headers: {
    //         "x-api-key": "CWtpiJIijL6RBI0y0bnBs94wljKqTieP7MOATXOl",
    //       },
    //     }
    //   )
    //     .then(async (res) => {
    //       const data = await res.json();
    //       console.log(data);
    //       setstate(data.body);
    //     })
    //     .catch((err) => console.log(err));
    await axios
      .post(
        "https://3c461g3x25.execute-api.ap-south-1.amazonaws.com/prod/signup",
        { email: "hamzah@abc.com" },
        {
          mode: "cors",
          credentials: "include",
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "CWtpiJIijL6RBI0y0bnBs94wljKqTieP7MOATXOl",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  };
  return (
    <div className="App">
      <button onClick={handleS}>Click Me</button>
      <h1>Results: {state}</h1>
    </div>
  );
}

export default App;
