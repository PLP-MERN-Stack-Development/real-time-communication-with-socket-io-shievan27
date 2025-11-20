import { useAuth } from "../context/AuthContext";

export default function MessageList({ messages }) {
  const { user } = useAuth();

  console.log("📩 MessageList received messages:", messages);


  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isSender = msg.sender === user?.username;
        return (
          <div
            key={msg.id}
            className={`flex ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                isSender
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
              }`}
            >
              {!isSender && (
                <p className="text-xs text-gray-300 mb-1">{msg.sender}</p>
              )}
              <p>{msg.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
