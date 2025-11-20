import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket, useSocket } from "../socket/socket";
import MessageList from "./messageList";
import MessageInput from "./messageInput";
import Sidebar from "./sidebar";
import PrivateChat from "./privateChat";
import { useAuth } from "../context/AuthContext";
import {useRef} from "react";

export default function ChatRoom({ onJoinRoom }) { 
  const { connect, sendMessage, sendPrivateMessage, messages, users } = useSocket();
  const { user } = useAuth();

  const { roomId } = useParams();
  const currentRoom = roomId || "general";

  const [roomMessages, setRoomMessages] = useState([]);
  const [activePrivateChat, setActivePrivateChat] = useState(null);

   const hasJoined = useRef(false);

    useEffect(() => {
      if (!user || !currentRoom || hasJoined.current) return;

      if (!socket.connected) connect(user.username, currentRoom);
      
      socket.emit("user_join", { username: user.username, room: currentRoom });
      hasJoined.current = true;

      return () => {
        socket.emit("leave_room", { username: user.username, room: currentRoom });
        hasJoined.current = false;
      };
    }, [user, currentRoom]);

  // ✅ FIX 1: Uncommented - Filter messages only for this room
   useEffect(() => {
    console.log("🎯 [ChatRoom] currentRoom:", currentRoom);
    console.log("🎯 [ChatRoom] messages from useSocket:", messages);

    const filtered = messages.filter((msg) => msg.room === currentRoom);
     console.log("🎯 [ChatRoom] filtered messages:", filtered);

    setRoomMessages(filtered);
   }, [messages, currentRoom]);
   console.log("🎯 roomMessages in ChatRoom:", roomMessages);
  // ✅ FIX 2: Pass msg and currentRoom as separate arguments, not as object
  const handleSend = (msg) => {
    sendMessage(msg, currentRoom);
  };

  const handlePrivateSend = (to, msg) => sendPrivateMessage(to, msg);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar
        users={users}
        currentRoom={currentRoom}
        onPrivateSelect={setActivePrivateChat}
        onJoinRoom={onJoinRoom}
      />

      <div className="flex flex-col flex-1 bg-gray-800">
        {activePrivateChat ? (
          <PrivateChat
            user={activePrivateChat}
            sendPrivateMessage={handlePrivateSend}
            onClose={() => setActivePrivateChat(null)}
          />
        ) : (
          <>
            <header className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-400">
                #{currentRoom}
              </h2>
              <p className="text-sm text-gray-400">
                Logged in as <span className="text-blue-400">{user?.username}</span>
              </p>
            </header>
            

            <MessageList messages={roomMessages} />
            

            <MessageInput onSend={handleSend} />
          </>
        )}
      </div>
    </div>
  );
}