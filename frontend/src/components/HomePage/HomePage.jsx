import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const socket = useSocket();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      {
        e.preventDefault();
        socket.emit("roomCreateJoin", { name, id });
        setName("");
        setId("");
      }
    },
    [name, id, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { name, id } = data;
      console.log(name, id);
      navigate(`/room/${id}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("roomCreateJoin", handleJoinRoom);

    return () => {
      socket.off("roomCreateJoin", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="container">
      <h1 className="app-name">Let's Hinge</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Display Name"
        />
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          type="text"
          placeholder="Call ID"
        />
        <button className="btn-1" type="submit">
          Join/Create Call
        </button>
      </form>
    </div>
  );
};

export default HomePage;
