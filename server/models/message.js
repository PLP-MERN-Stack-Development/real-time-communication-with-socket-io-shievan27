// models/ChatMessage.js
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  sender: String,
  senderId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  to: String, // optional: for private messages
});

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
