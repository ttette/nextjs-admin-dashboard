import { useState, useEffect } from "react";
import { SignOffButton } from "./SignOffButton";
import io from "socket.io-client";

let socket;

export const StakeholderCollaboration = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSignedOff, setIsSignedOff] = useState(false);

  useEffect(() => {
    // Fetch the initial sign-off status and chat history
    const fetchInitialData = async () => {
      try {
        const [signOffRes, chatRes] = await Promise.all([
          fetch("/api/sign-off"),
          fetch("/api/chat"),
        ]);

        if (signOffRes.ok) {
          const data = await signOffRes.json();
          setIsSignedOff(data.isSignedOff);
        }

        if (chatRes.ok) {
          const data = await chatRes.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected!");
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("status-verified", () => {
      setIsSignedOff(true);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const msg = {
        user: "You", // This should be replaced with the actual user's name
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("chat message", msg);
      setNewMessage("");
    }
  };

  const handleSignOff = async () => {
    if (!isSignedOff) {
      try {
        const response = await fetch("/api/sign-off", { method: "POST" });
        if (response.ok) {
          socket.emit("sign-off");
        }
      } catch (error) {
        console.error("Error signing off:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-dark p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Stakeholder Collaboration</h3>
      {isSignedOff && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Verified</p>
          <p>This article has been signed off.</p>
        </div>
      )}
      <div className="chat-window h-64 overflow-y-auto mb-4 border rounded p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.user === "You" ? "text-right" : ""}`}>
            <p className="text-sm">
              <strong>{msg.user}:</strong> {msg.text}
            </p>
            <p className="text-xs text-gray-500">{msg.time}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </form>
      <div className="mt-4">
        <SignOffButton isSignedOff={isSignedOff} onSignOff={handleSignOff} />
      </div>
    </div>
  );
};
