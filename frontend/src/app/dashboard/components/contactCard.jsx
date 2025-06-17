import axios from 'axios';
import { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import { useAuth } from '@/utils/Auth';

export default function Card({
  clickedUser,
  selected,
  createConversation,
  conversation,
}) {
  const { user } = useAuth();
  console.log(clickedUser);
  const handleClick = () => {
    if (clickedUser) {
      createConversation(clickedUser._id);
    }

    socket.emit('join', user._id);
  };
  return (
    <div
      className={`flex items-center gap-3 p-3 transition-colors duration-200 ease-in-out cursor-pointer border-t border-x first:border-t-0 border-gray-200
      ${
        selected
          ? 'bg-blue-50 border-l-blue-500 border-l-4'
          : 'bg-white hover:bg-gray-50'
      }`}
      onClick={() => {
        handleClick();
      }}
    >
      <div className="flex-shrink-0">
        <img
          src="./ProfileIcon.svg"
          alt={clickedUser.userName}
          className="w-10 h-10 object-cover border border-gray-200"
        />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center gap-2">
          <p
            className={`text-sm font-medium truncate ${
              selected ? 'text-blue-800' : 'text-gray-900'
            }`}
          >
            {clickedUser.userName}
          </p>
          <span
            className={`text-xs whitespace-nowrap flex-shrink-0 ${
              selected ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {new Date(clickedUser.lastSeen).toLocaleDateString()}
          </span>
        </div>
        <p
          className={`text-xs truncate mt-0.5 ${
            selected ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {conversation ? conversation.lastMessage.text : null}
        </p>
      </div>
    </div>
  );
}
