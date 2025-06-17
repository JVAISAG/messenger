'use client';

import { Button } from '@/components/ui/button';

import { IoMdMenu } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MdOutlineBookmarkAdded } from 'react-icons/md';
import { MdOutlineContacts } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { IoMdHelp } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContactCard from './components/contactCard';
import LeftSide from './left-side';
import RightSide from './rightSide';
import './chat.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/Auth';
import { toast } from 'sonner';

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState({});
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState();

  const { user, token, setToken_, setUser } = useAuth();

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('jwt');
      const savedUser = localStorage.getItem('user');

      if (savedToken) {
        setToken_(savedToken);
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.log('error');
      console.error(err);
    }
  }, []);

  const getAllUserConversations = async () => {
    try {
      if (user && token) {
        const data = await axios.post(
          'http://localhost:5000/conversations/userConversation',
          { user: user?._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const conversationData = data.data.data.conversations;

        return conversationData;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUserConversations();
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        if (token) {
          const res = await axios.get('http://localhost:5000/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserList(res.data.data.users);
        }
      } catch (err) {
        console.log(err);
        toast.error('Internal server error!');
      }
    };
    getAllUsers();
  }, [user, token]);

  const selectConversation = (index, selected) => {
    setSelectedConversation(index);
    setSelected(selected);
  };

  return (
    <div id="container">
      <div id="left-side">
        <LeftSide
          loading={loading}
          selectConversation={selectConversation}
          userList={userList}
          getAlluserConversations={getAllUserConversations}
        />
      </div>
      <div id="right-side">
        {selected === true ? (
          <RightSide
            selectedCard={selectedConversation}
            user={user}
            token={token}
          />
        ) : null}
      </div>
    </div>
  );
}
