// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { setupSocket } from "./socket/index.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173"], // your frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Realtime Chat Server is running"));

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
setupSocket(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
