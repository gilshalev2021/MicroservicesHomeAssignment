import { useEffect, useState } from 'react';
import './App.css';

import io from 'socket.io-client';
import Message from './models/message';
import axios from 'axios';
const socket = io('http://localhost:5100');

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleStatusUpdate = (status: Message) => {
    // Find the corresponding message in the array and update its status
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.message === status.message ? { ...msg, status: status.status } : msg
      )
    );
  };

  const sendMessage = async () => {
    const newMessage = message.trim();

    if (newMessage === "") return;

    // Send message to Microservice A via HTTP POST request
    try {
      await axios.post("http://localhost:5100/message", {
        message: newMessage,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { message: newMessage, status: "pending" },
      ]);
    } catch (error: any) {
      console.error("Error:", error.message);
    }
    setMessage("");
  };

  useEffect(() => {
    // Subscribe to the 'message' event from the WebSocket server
    socket.on("messageStatus", handleStatusUpdate);

    return () => {
      // Clean up event subscription
      socket.off("messageStatus", handleStatusUpdate);
    };
  }, []);

  return (
    <div className="App" style={{ backgroundColor: "#f2f2f2" }}>
      <div
        className="toolbar"
        style={{
          backgroundColor: "#333",
          padding: "1px",
          color: "#fff",
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Cync Client Application</h2>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message here"
            style={{
              marginRight: "10px",
              height: "30px",
              width: "300px",
            }}
          />
          <button
            style={{
              padding: "8px 20px",
              fontSize: "16px",
              height: "36px",
            }}
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            margin: "5px",
          }}
        >
          {messages.map((msg, index) => (
            <li
              key={index}
              style={{
                padding: "10px",
              }}
            >
              Message: {msg.message}, Status: {msg.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
