import { useLayoutEffect } from "react";

import Content from "./Components/Content";
import Header from "./Components/Header";

import "./App.css";

function App() {
  // Prerequisites alert
  useLayoutEffect(() => {
    alert("I hope you have gone through prerequisites in Readme file ");
  }, []);
  return (
    <main className="App">
      <Header />
      <Content />
    </main>
  );
}

export default App;
