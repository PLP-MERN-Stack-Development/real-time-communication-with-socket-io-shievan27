export default function MessageBubble({ message, currentUser }) {
  const isOwn = message.sender === currentUser?.username;

  return (
    <div
      className={`flex flex-col mb-3 px-3 ${
        isOwn ? "items-end" : "items-start"
      }`}
    >
      {!isOwn && (
        <span className="text-xs text-gray-500 mb-1">{message.sender}</span>
      )}

      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-md ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none self-end"
            : "bg-gray-200 text-gray-900 rounded-bl-none self-start"
        }`}
      >
        <p className="break-words">{message.message}</p>
      </div>

      <span
        className={`text-[10px] text-gray-400 mt-1 ${
          isOwn ? "text-right" : "text-left"
        }`}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
