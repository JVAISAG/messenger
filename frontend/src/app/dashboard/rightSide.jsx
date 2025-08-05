'use client';

import axios from 'axios';
import Image from 'next/image';
import './chat.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuSendHorizontal } from 'react-icons/lu';
import Message from './components/messages';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/utils/Auth';
import socket from '@/utils/socket';
import api from '@/utils/axios';
import {
  decryptMessage,
  decryptWithPassword,
  EncryptMessage,
} from '@/utils/encryption';

export default function RightSide({ conversation, reciever }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messageRef = useRef(null);

  const { user, token } = useAuth();

  useEffect(() => {
    messageRef?.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessages = async () => {
    try {
      const messageResponse = await api.get(
        `/conversations/${conversation._id}/messages`
      );
      const data = messageResponse.data.data.message;

      const dataForSender = data.filter(
        (el) => el.forSender === true && el.senderId === user._id
      );
      const dataForRecipient = data.filter((el) => el.forSender === false);

      const response = await api.get(`message/publickey/${user._id}`);
      const recieverPublicKeyRes = await api.get(
        `message/publickey/${reciever._id}`
      );

      const recieverPublicKey = recieverPublicKeyRes.data.key.myPublicKey;

      const senderPublicKey = response.data.key.myPublicKey;

      const privateKeyResponse = await api.get(`message/privatekey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const myPrivateKey = privateKeyResponse.data.key.privateKey;
      const pKey = decryptWithPassword(myPrivateKey, 'Vaisag@2004');
      const privateKey = decryptWithPassword(myPrivateKey, 'Vaisag@2004');

      const decryptedAll = await Promise.all([
        ...dataForRecipient.map(async (el) => {
          const message = { ...el };
          const decrypted = decryptMessage({
            message: el.content.encryptedMessage,
            senderPublicKey: recieverPublicKey,
            reciverPrivateKey: pKey,
            nonce: el.content.nonce,
          });

          return { ...message, decryptedMessage: decrypted };
        }),
        ...dataForSender.map(async (el) => {
          const message = { ...el };
          const decrypted = decryptMessage({
            message: el.content.encryptedMessage,
            senderPublicKey: senderPublicKey,
            reciverPrivateKey: privateKey,
            nonce: el.content.nonce,
          });

          return { ...message, decryptedMessage: decrypted };
        }),
      ]);

      const uniqueMessages = decryptedAll
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .filter((message, index, arr) => {
          // Find the first occurrence of this message content + sender combination
          const firstIndex = arr.findIndex(
            (m) =>
              m.senderId === message.senderId &&
              m.decryptedMessage.trim() === message.decryptedMessage.trim() &&
              Math.abs(
                new Date(m.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 1000 // Within 1 seconds
          );

          // Keep only if this is the first occurrence
          return firstIndex === index;
        });

      setMessages(uniqueMessages);
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

    socket.on('recieve-message', async (data) => {
      console.log('current: ', data);
      const message = data.message.content.encryptedMessage;
      const nonce = data.message.content.nonce;

      const response = await api.get(`message/publickey/${data.sender}`);
      const senderPublicKey = response.data.key.myPublicKey;

      const res = await api.get(`message/privatekey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const myPrivateKey = res.data.key.privateKey;
      const pKey = decryptWithPassword(myPrivateKey, 'Vaisag@2004');

      const decryptedMessage = decryptMessage({
        message,
        senderPublicKey,
        reciverPrivateKey: pKey,
        nonce,
      });

      const currentMessage = { ...data.message };
      currentMessage['decryptedMessage'] = decryptedMessage;

      setMessages((prev) => [...prev, currentMessage]);
    });

    return () => {
      socket.off('recieve-message');
    };
  }, [conversation._id, user._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageDateForSender = { ...messageData };

    const response = await api.get(
      `message/publickey/${messageData.recieverId}`
    );

    const recieverPublicKey = response.data.key.myPublicKey;

    const res = await api.get(`message/privatekey`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const privateKey = res.data.key.privateKey;

    const publicKeyPromise = await api.get(`message/publickey/${user._id}`);
    const senderPublicKey = publicKeyPromise.data.key.myPublicKey;

    const pKey = decryptWithPassword(privateKey, 'Vaisag@2004');

    const encryptedMessageForRecipient = EncryptMessage({
      message: message,
      recipientPublicKey: recieverPublicKey,
      senderPrivateKey: pKey,
    });

    const encryptedMessageForSender = EncryptMessage({
      message: message,
      recipientPublicKey: senderPublicKey,
      senderPrivateKey: pKey,
    });

    const currentMessageData = { ...messageData };
    currentMessageData['decryptedMessage'] = message;
    currentMessageData['createdAt'] = Date.now();
    messageData['content'] = encryptedMessageForRecipient;

    socket.emit('send-message', {
      roomId: conversation._id,
      message: messageData,
      sender: user._id,
    });

    setMessages((prev) => [...prev, currentMessageData]);
    setMessage('');

    try {
      await api.post('/message', messageData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }

    messageDateForSender['content'] = encryptedMessageForSender;
    messageDateForSender['forSender'] = true;
    try {
      await api.post('/message', messageDateForSender, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log('message error:', err);
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
            {reciever ? reciever.userName : 'user'}
          </p>
          <p className="text-sm text-gray-500">
            {user
              ? `last seen ${new Date(reciever?.lastSeen).toLocaleDateString() || 'undefined'}`
              : '...'}
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
      <div ref={messageRef} />

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
