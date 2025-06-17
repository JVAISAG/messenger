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

export default function RightSide({ selectedCard, selected, user, token }) {
  const [message, setMessage] = useState();

  const getUser = async (userName) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/user',
        { userName: userName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const messageData = {
    senderId: user._id,
    recieverId: user._id,
    content: message,
    conversation: selectedCard._id,
    type: 'text',
  };
  useEffect(() => {
    try {
      const getUserName = async () => {
        const data = await axios.get(
          `http://localhost:5000/user/${selectedCard.lastMessage.senderId}`
        );
        const userData = data.data.data.users;

        setUser(userData);
      };

      const getMessages = async () => {
        const messages = await axios.get('http://localhost:5000/message');
        console.log('message : ', messages.data.data);
      };
      getUserName();
      getMessages();
    } catch (err) {
      console.log(err);
    }
  }, [selectedCard]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/message',
        messageData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div id="chat-container">
      <header id="chat-header">
        <div
          id="chat-profile-pic"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="./ProfileIcon.svg"
            alt="selectedCard.name"
            width={40}
            height={40}
          />
        </div>
        <div id="profile-name" className="flex flex-col justify-center ml-3">
          <p className="text-base  self-start font-semibold">
            {user !== undefined ? user.userName : 'Loading...'}
          </p>
          <p className="text-sm text-gray-500">
            {user !== undefined
              ? `last seen ${new Date(user.lastSeen).toLocaleTimeString()}`
              : '...'}
          </p>
        </div>
      </header>
      <div id="message-box">
        <div></div>
        <div id="message-sender">
          <Input
            type="text"
            id="message-input"
            className="
              w-full
              bg-white                  /* Pure white background */
              text-black                /* High-contrast text */
              border border-gray-200    /* Very subtle border */
              rounded-lg                /* Medium rounded corners (Tailwind's 'lg' radius) */
              shadow-sm                 /* Subtle shadow */
              hover:shadow-md           /* Slightly stronger shadow on hover */
              focus-visible:ring-2      /* Focus ring */
              focus-visible:ring-blue-500
              focus-visible:border-transparent  /* Hide border on focus */
              transition-all duration-200
              [&::placeholder]:text-gray-400    /* Subtle placeholder text */
            "
            placeholder="message"
            name="message"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <Button
            variant="secondary"
            id="btn-send"
            style={{
              borderRadius: '20px',
              width: '43px',
              height: '43px',
              background: 'lightblue',
            }}
            onClick={(e) => {
              handleSend(e);
            }}
          >
            <LuSendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
}
