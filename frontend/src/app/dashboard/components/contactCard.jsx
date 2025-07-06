import axios from 'axios';
import { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import { useAuth } from '@/utils/Auth';
import RightSide from '../rightSide';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Card({
  clickedUser,
  selected,
  createConversation,
  setReciever,
  conversation,
}) {
  const { user, token } = useAuth();
  const [otherUser, setOtherUser] = useState();
  // console.log(setReciever);
  // console.log(conversation);
  useEffect(() => {
    console.log('hello');
    const getUser = async () => {
      try {
        if (clickedUser) {
          const res = await axios.get(
            `http://localhost:5000/user/${clickedUser}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setOtherUser(res.data.data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [clickedUser]);

  const handleClick = () => {
    if (createConversation) {
      console.log('conversation create');
      createConversation(clickedUser);
    }
    setReciever(otherUser);
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
        border border-gray-200 rounded-lg shadow-sm
        ${selected ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <Avatar>
          <AvatarImage src={otherUser.profilePic} alt="ProfileIcon.svg" />
          <AvatarFallback>{otherUser?.userName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p
            className={`text-sm font-medium truncate ${
              selected ? 'text-blue-800' : 'text-gray-900'
            }`}
          >
            {otherUser?.userName}
          </p>
          <span
            className={`text-xs whitespace-nowrap ${
              selected ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {new Date(otherUser?.lastSeen).toLocaleDateString()}
          </span>
        </div>
        <p
          className={`text-xs truncate mt-1 ${
            selected ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {conversation?.lastMessage || 'Start a conversation'}
        </p>
      </div>
    </div>
  );
}
