import { useState } from "react";

// Add onJoinRoom to props
export default function Sidebar({ users, currentRoom, onPrivateSelect, onJoinRoom }) {
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (room.trim()) {
      onJoinRoom(room); // Call the function from App.jsx
      setRoom(""); // Clear the input after joining
    }
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      
      {/* --- Room Selector UI --- */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-blue-400 mb-3">Join Room</h3>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
          className="border border-gray-600 bg-gray-700 rounded-lg p-2 w-full mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
        >
          Join or Create
        </button>
      </div>
      {/* --- End Room Selector UI --- */}

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-blue-400">Active Users</h3>
        <p className="text-xs text-gray-400">Current Room: #{currentRoom}</p>
      </div>
      <ul className="flex-1 overflow-y-auto p-4 space-y-2">
        {users.length === 0 && (
          <p className="text-gray-500 text-sm">No users online</p>
        )}
        {users.map((u) => (
          <li
            key={u.id}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-700 transition"
            onClick={() => onPrivateSelect(u)}
          >
            {u.username}
          </li>
        ))}
      </ul>
    </aside>
  );
}