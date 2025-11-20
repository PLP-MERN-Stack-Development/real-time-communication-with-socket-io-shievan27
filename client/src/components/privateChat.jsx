import { useState } from "react";

export default function PrivateChat({ user, sendPrivateMessage, onClose }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendPrivateMessage(user.id, text);
    setMessages((prev) => [
      ...prev,
      { sender: "You", message: text, id: Date.now() },
    ]);
    setText("");
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-800">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-blue-400 font-semibold">
          Private Chat with {user.username}
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-red-400"
        >
          ✕ Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl ${
                m.sender === "You"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
              }`}
            >
              <p>{m.message}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-700 flex items-center gap-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a private message..."
          className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
