// socket/index.js
import {ChatMessage} from "../models/message.js";

const users = {};
const messages = [];
const typingUsers = {};

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("user_join", async ({ username, room }) => {
        users[socket.id] = { username, room, id: socket.id };
        socket.join(room);

        // Send back message history for that room only
        const previousMessages = await ChatMessage.find({ room })
          .sort({ timestamp: 1 })
          .limit(50);

        socket.emit("previous_messages", previousMessages);
        io.to(room).emit("user_list", Object.values(users).filter(u => u.room === room));
        io.to(room).emit("user_joined", { username, id: socket.id, room });
    });

    socket.on("send_message", async (messageData, callback) => {
      const user = users[socket.id];
      
      console.log("📥 Received messageData:", JSON.stringify(messageData));
      console.log("📥 Type of messageData:", typeof messageData);
      
      // ✅ FIX: Extract the message string from messageData
      const messageText = typeof messageData === 'string' 
        ? messageData 
        : messageData.message;
      
      const room = messageData.room || user?.room || "general";

      const message = {
        message: messageText,  // ✅ Just the string, not the whole object
        sender: user?.username || "Anonymous",
        senderId: socket.id,
        room: room,
        timestamp: new Date(),
      };

      console.log("💾 Attempting to save:", JSON.stringify(message));

      try {
        // 1. Try to save the message FIRST
        const savedMessage = await ChatMessage.create(message);
        console.log("✅ Message saved successfully:", savedMessage._id);

        // 2. If save is SUCCESSFUL, THEN emit the message to the room
        const messageToEmit = {
          id: savedMessage._id,
          message: savedMessage.message,
          sender: savedMessage.sender,
          senderId: savedMessage.senderId,
          room: savedMessage.room,
          timestamp: savedMessage.timestamp,
        };
        
        io.to(room).emit("receive_message", messageToEmit);
        
        // 3. Tell the sender's client it was successful
        if (callback) callback({ status: "sent", message: messageToEmit });

      } catch (err) {
        // 4. If save FAILS, log the error...
        console.error("❌ Error saving message:", err.message);

        // 5. ...and tell the sender's client it FAILED.
        if (callback) {
          callback({ 
            status: "error", 
            error: "Message failed to save. Please try again." 
          });
        }
      }
    });

    socket.on("private_message", async ({ to, message }) => {
        const msg = {
          sender: users[socket.id]?.username || "Anonymous",
          senderId: socket.id,
          message: message,  // ✅ This is already correct - just the string
          timestamp: new Date(),
          isPrivate: true,
          to,
        };

        try {
          // 1. Try to save FIRST
          const savedMsg = await ChatMessage.create(msg);

          // 2. If save is SUCCESSFUL, THEN emit to both users
          const msgToEmit = {
            id: savedMsg._id,
            sender: savedMsg.sender,
            senderId: savedMsg.senderId,
            message: savedMsg.message,
            timestamp: savedMsg.timestamp,
            isPrivate: true,
            to: savedMsg.to,
          };

          socket.to(to).emit("private_message", msgToEmit);
          socket.emit("private_message", msgToEmit);

        } catch (err) {
          // 3. If save FAILS, log the error...
          console.error("❌ Error saving private message:", err.message);

          // 4. ...and tell the SENDER's client it failed.
          socket.emit("message_save_error", {
            error: "Private message failed to send. Please try again.",
            originalMessage: msg
          });
        }
    });

    socket.on("reconnect", () => {
        if (users[socket.id]) {
          socket.emit("previous_messages", messages);
          io.emit("user_list", Object.values(users));
        }
      });

    
    let typingTimeout;
    socket.on("typing", (isTyping) => {
      const username = users[socket.id]?.username;
      if (!username) return;

      if (isTyping) {
        typingUsers[socket.id] = username;
        io.emit("typing_users", Object.values(typingUsers));

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          delete typingUsers[socket.id];
          io.emit("typing_users", Object.values(typingUsers));
        }, 3000);
      } else {
        delete typingUsers[socket.id];
        io.emit("typing_users", Object.values(typingUsers));
      }
    });


    socket.on("disconnect", () => {
      const { username } = users[socket.id] || {};
      if (username) {
        io.emit("user_left", { username, id: socket.id });
        console.log(`🔴 ${username} disconnected`);
      }
      delete users[socket.id];
      delete typingUsers[socket.id];
      io.emit("user_list", Object.values(users));
      io.emit("typing_users", Object.values(typingUsers));
    });
  });
};