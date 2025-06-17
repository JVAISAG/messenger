'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
import Chats from './components/chats';
import { Url } from 'next/dist/shared/lib/router/router';
import { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import './chat.css';
import SearchTab from './components/searchTab';
import { useAuth } from '@/utils/Auth';
import { PopoverClose } from '@radix-ui/react-popover';

export default function LeftSide({
  loading,
  selectConversation,
  userList,
  getAlluserConversations,
}) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState(userList);

  const { user, token } = useAuth();

  const handleClick = () => {
    if (user) {
      createConversation();
    }

    socket.emit('join', user._id);
  };
  const getAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/user');
      setUsers(res.data.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  const createConversation = async (value) => {
    const data = {
      participants: [value, user._id],
      senderId: user._id,
    };
    try {
      const res = await axios.post(
        'http://localhost:5000/conversations',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const conv = getAlluserConversations();
    setConversations(conv);
  }, []);

  return (
    <div id="left-container-chat">
      <header>
        <div id="header-container">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <IoMdMenu />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div id="div1">
                <div id="profile">
                  <Button variant="ghost">
                    <Avatar>
                      <AvatarImage src="./next.svg" />
                      <AvatarFallback>V</AvatarFallback>
                    </Avatar>
                    <p>Name</p>
                  </Button>
                </div>
              </div>
              <div id="div2">
                <div id="saved-messages">
                  <Button variant="ghost">
                    <MdOutlineBookmarkAdded /> <p>Saved Messages</p>
                  </Button>
                </div>
                <div id="contacts">
                  <Button variant="ghost">
                    <MdOutlineContacts />
                    <p>Contacts</p>
                  </Button>
                </div>
              </div>
              <div id="div3">
                <div id="settings">
                  <Button variant="ghost">
                    <MdOutlineSettings /> <p>Settings</p>
                  </Button>
                </div>
                <div id="help">
                  <Button vindexariant="ghost">
                    <IoMdHelp /> <p>Help</p>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <SearchTab
            userList={userList}
            createConversation={createConversation}
          />
        </div>
      </header>
      <div id="body">
        <Chats
          contacts={conversations}
          setSelectedConversation={setSelectedConversation}
          selectConversation={selectConversation}
          loading={loading}
          selectedConversation={selectedConversation}
        />
      </div>
    </div>
  );
}
