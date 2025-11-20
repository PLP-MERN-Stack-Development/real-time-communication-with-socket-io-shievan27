import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../socket/socket";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";

export default function ChatPage() {
  const { user } = useAuth();
  const { connect, disconnect, sendMessage, messages, typingUsers, setTyping } = useSocket();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (user?.username) {
      connect(user.username);
    }
    return () => disconnect();
  }, [user]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
      users={[]} 
      currentUser={user}
      onSelectUser={() => {}}
      onLogout={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message, i) => (
            <MessageBubble key={i} message={message} currentUser={user.username} />
          ))}
          <TypingIndicator typingUsers={typingUsers} />
        </div>
        <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setTyping(e.target.value.length > 0);
            }}
            placeholder="Type your message..."
            className="flex-1 border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
