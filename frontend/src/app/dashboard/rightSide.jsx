'use client';

import axios from 'axios';
import Image from 'next/image';
import './chat.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuSendHorizontal } from 'react-icons/lu';
import Message from './components/messages';
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/Auth';
import socket from '@/utils/socket';

export default function RightSide({ conversation, reciever }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user, token } = useAuth();

  const getMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/conversations/${conversation._id}/messages`
      );
      setMessages(res.data.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMessages();
  }, [conversation]);

  const messageData = {
    senderId: user._id,
    recieverId: reciever?._id,
    content: message,
    conversation: conversation?._id,
    type: 'text',
  };

  useEffect(() => {
    if (!conversation?._id || !user?._id) return;

    socket.emit('join-room', { roomId: conversation._id, userId: user._id });

    socket.on('recieve-message', (data) => {
      console.log('message: ', data);
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off('recieve-message');
    };
  }, [conversation._id, user._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit('send-message', {
      roomId: conversation._id,
      message: messageData,
      sender: user._id,
    });

    setMessages((prev) => [...prev, messageData]);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/message', messageData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="chat-container">
      {/* Header */}
      <header
        id="chat-header"
        className="bg-white border-b px-4 py-3 flex items-center gap-3"
      >
        <Image
          src="/ProfileIcon.svg"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-gray-800">
            {reciever ? reciever.userName : 'Loading...'}
          </p>
          <p className="text-sm text-gray-500">
            {user ? `last seen ${new Date().toLocaleTimeString()}` : '...'}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        id="message-box"
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
      >
        {messages.length > 0 ? (
          messages.map((mess, idx) => <Message key={idx} message={mess} />)
        ) : (
          <p className="text-gray-400 text-sm text-center mt-4">
            No messages yet
          </p>
        )}
      </div>

      {/* Input */}
      <form
        id="message-sender"
        onSubmit={handleSend}
        className="bg-white px-4 py-3 border-t flex gap-2 items-center"
      >
        <Input
          type="text"
          placeholder="Type a message..."
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 text-sm shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="submit"
          id="btn-send"
          className="rounded-full w-[43px] h-[43px] flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
        >
          <LuSendHorizontal size={20} />
        </Button>
      </form>
    </div>
  );
}
