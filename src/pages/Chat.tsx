import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    try {
      // Send the user input to the backend
      const response = await axios.post('http://localhost:8000/chat', {
        user_query: input,
      });

      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: response.data.answer,  // Assuming the response from FastAPI contains the field `answer`
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Optionally handle error response
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Card className="h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="h-6 w-6 text-[#646cff]" />
          <h2 className="text-2xl font-bold">Chat with Nutritionist</h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-[#646cff] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex space-x-2">
          <Input
            label=""
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </div>
  );
};
