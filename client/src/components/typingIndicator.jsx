// src/components/TypingIndicator.jsx
export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.join(", ")} are typing...`;

  return (
    <div className="px-4 py-1 text-sm italic text-gray-500 bg-gray-50 border-t">
      {text}
    </div>
  );
}
