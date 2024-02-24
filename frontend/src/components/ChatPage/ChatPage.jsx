import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import ReactPlayer from "react-player";
import peer from "../../service/peer";

const ChatPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [peerInstance, setPeerInstance] = useState(peer);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [callStarted, setCallStarted] = useState(false);

  const handleUserJoined = useCallback(({ name, id }) => {
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const offer = await peer.getOffer();
      socket.emit("userCall", { to: remoteSocketId, offer });
      setMyStream(stream);
      setCallStarted(true);
    } catch (error) {
      console.error("Error accessing media devices:", error.message);
    }
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("callAccepted", { to: from, ans });
      setCallStarted(true);
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        const sender = peer.peer.getSenders().find((s) => s.track === track);
        if (!sender) {
          peer.peer.addTrack(track, myStream);
        }
      }
    }
  }, [myStream, peer]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call accepted");
      sendStreams();
      setCallStarted(true);
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () =>
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
  }, [handleNegoNeeded]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  const handleEndCall = useCallback(() => {
    try {
      if (remoteSocketId) {
        socket.emit("callEnded", { to: remoteSocketId });
      }

      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }

      setMyStream(null);
      setPeerInstance(null);

      setRemoteSocketId(null);
      setMyStream(null);
      setRemoteStream(null);
      setCallStarted(false);

      socket.emit("callEnded", { to: remoteSocketId });

      navigate("/");
    } catch (error) {
      console.error("Error ending the call:", error.message);
    }
  }, [myStream, remoteStream, peer, navigate]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incommingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("callEnded", handleEndCall);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incommingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("callEnded", handleEndCall);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
    handleEndCall,
  ]);

  return (
    <div className="chatPage">
      <h1 className="chat-heading">ChatPage</h1>
      <h4 className="chat-status">
        {remoteSocketId ? "Connected" : "No one in a room"}
      </h4>

      <div className="videoContainer">
        <div>
          {myStream && (
            <>
              <h1 style={{ color: "white" }}>My Stream</h1>
              <ReactPlayer playing muted width="500px" url={myStream} />
            </>
          )}
        </div>
        <div>
          {remoteStream && (
            <>
              <h1 style={{ color: "white" }}>Remote Stream</h1>
              <ReactPlayer playing muted width="500px" url={remoteStream} />
            </>
          )}
        </div>
      </div>

      <div className="buttons">
        {remoteSocketId && (
          <button
            className="call-btn"
            onClick={callStarted ? handleEndCall : handleCallUser}>
            {callStarted ? "END" : "CALL"}
          </button>
        )}
        {myStream && (
          <button className="stream-btn" onClick={sendStreams}>
            Send Stream
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
