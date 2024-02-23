import React from "react";
import Nav from "./components/HomePage/Nav";

const App = () => {
  return (
    <div className="container">
      <h1 className="app-name">Let's Hinge</h1>
      <Nav
        statusType="Display Name"
        buttonType="Create Call"
        bgColor="#AF5A76"
        color="#141414"
      />
      <Nav
        statusType="Call ID"
        buttonType="Join Call"
        bgColor="#E5C9D2"
        color="#141414"
      />
    </div>
  );
};

export default App;
