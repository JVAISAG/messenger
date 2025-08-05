'use client';
import LeftSide from './left-side';
import RightSide from './rightSide';
import './chat.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/Auth';
import api from '@/utils/axios';

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState({});
  const [reciever, setReciever] = useState({});
  const [conversation, setConversations] = useState([{}]);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState();

  const { user, token, setToken_, setUser } = useAuth();

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('jwt');
      const savedUser = localStorage.getItem('user');

      if (savedToken) setToken_(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const getAllUserConversations = async () => {
      try {
        if (user && token) {
          const { data } = await api.get('/conversations/userConversation', {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log(data.data.conversations);
          setConversations(data.data.conversations);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getAllUserConversations();
  }, [user, token, reciever]);

  const selectConversation = (index, selected) => {
    setSelectedConversation(index);
    setSelected(selected);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white border">
      <div className="w-[380px] border-r border-gray-200 bg-white">
        <LeftSide
          loading={loading}
          selectConversation={selectConversation}
          userList={userList}
          conversation={conversation}
          setReciever={setReciever}
        />
      </div>
      <div className="flex-1">
        {selected && (
          <RightSide
            conversation={selectedConversation}
            reciever={reciever && reciever}
          />
        )}
      </div>
    </div>
  );
}
