import React from "react";
import VideoPlayer from "./VideoPlayer";
import Options from "./Options";
import Notifications from "./Notifications";

const ChatPage = () => {
  return (
    <div>
      <h1>ChatPage</h1>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
};

export default ChatPage;
