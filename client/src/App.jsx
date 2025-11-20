import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./socket/socket";
import RoomSelector from "./pages/roomSelectionPage";
import ChatRoom from "./components/chatroom";
import AuthPage from "./components/authPage";
import "./App.css";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  const { joinRoom } = useSocket();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleJoinRoom = (room) => {
    if (!room) {
      // Avoid alert(); use console.error instead
      console.error("Please enter a room name.");
      return;
    }

    const username = user?.username || user?.name || "Anonymous";
    joinRoom(username, room); 
    
    // Navigate to the new room URL
    navigate(`/chat/${room}`);
  };

  return (
    <>
    {/* Add global styles here since we can't import App.css
      This ensures Tailwind's preflight styles (like dark mode bg) apply
    */}
    <style>{`
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #1a202c; /* bg-gray-900 */
      }
    `}</style>
    <Routes>
      {/* Auth page is the default route */}
      <Route path="/" element={<AuthPage />} />

      {/* The chat route now catches all rooms dynamically
        e.g., /chat/general, /chat/random
      */}
      <Route
        path="/chat/:roomId"
        element={
          <PrivateRoute>
            <ChatRoom onJoinRoom={handleJoinRoom} />
          </PrivateRoute>
        }
      />

      {/* Redirect from /chat to /chat/general */}
      <Route
        path="/chat"
        element={<Navigate to="/chat/general" />}
      />

      {/* Fallback route redirects to auth page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}