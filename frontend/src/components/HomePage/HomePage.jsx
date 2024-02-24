import React, { useState } from "react";

const HomePage = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleSubmit1 = (e) => {
    e.preventDefault();
    console.log(name);
  };
  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log(id);
  };

  return (
    <div className="container">
      <h1 className="app-name">Let's Hinge</h1>

      <form className="form" onSubmit={handleSubmit1}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Display Name"
        />
        <button className="btn-1" type="submit">
          Create Call
        </button>
      </form>
      <form className="form" onSubmit={handleSubmit2}>
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
