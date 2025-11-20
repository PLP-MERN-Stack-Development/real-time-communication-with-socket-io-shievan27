import { useSocket } from "../socket/socket";
import { useState } from "react";

export default function RoomSelectorPage({ username, onJoinRoom }) {
  const { joinRoom, leaveRoom } = useSocket();
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (room.trim()) {
      joinRoom(username, room);
      onJoinRoom(room);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-96">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Join a Chat Room
        </h1>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
