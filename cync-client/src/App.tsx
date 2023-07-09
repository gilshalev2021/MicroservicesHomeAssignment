import { useEffect, useState } from 'react';
import './App.css';

import io from 'socket.io-client';
import Message from './models/message';
import axios from 'axios';
const socket = io('http://localhost:5100');

function App() {

  const [message, setMessage] = useState('');
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
  
    if (newMessage === '') return;

    // Send message to Microservice A via HTTP POST request
    try {
      await axios.post('http://localhost:5100/message', { message: newMessage });
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: newMessage, status: 'pending' },
      ]);
    } catch (error: any) {
      console.error('Error:', error.message);
    }
    setMessage('');
  };

  useEffect(() => {
    // Subscribe to the 'message' event from the WebSocket server
    socket.on('messageStatus', handleStatusUpdate);

    return () => {
      // Clean up event subscription
      socket.off('messageStatus', handleStatusUpdate);
    };
  }, []);
  

  return (
    <div className="App">
    <h1>Cync Client Application</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            Message: {msg.message}, Status: {msg.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
