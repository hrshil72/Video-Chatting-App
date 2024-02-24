import React, { useState } from "react";

const HomePage = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  return (
    <div className="container">
      <h1 className="app-name">Let's Hinge</h1>

      <form className="form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Display Name"
        />
        <button className="btn-1" type="submit">
          Create Call
        </button>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          type="text"
          placeholder="Call ID"
        />
        <button className="btn-2" type="submit">
          Join Call
        </button>
      </form>
    </div>
  );
};

export default HomePage;
