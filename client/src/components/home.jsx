import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JoinPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Save user and go to chatroom
    login({ username });
    navigate("/chatroom");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to ChatZone 💬</h1>
        <p className="text-gray-500 mb-6">Connect and chat with people instantly.</p>

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Join Chat
          </button>
        </form>

        <div className="mt-8 text-gray-400 text-sm">
          Made with ❤️ by <span className="text-blue-500 font-medium">Mjay</span>
        </div>
      </div>
    </div>
  );
}
