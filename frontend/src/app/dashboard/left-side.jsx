'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IoMdMenu, IoMdHelp } from 'react-icons/io';
import {
  MdOutlineBookmarkAdded,
  MdOutlineContacts,
  MdOutlineSettings,
} from 'react-icons/md';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/Auth';
import axios from 'axios';
import SearchTab from './components/searchTab';
import Chats from './components/chats';

export default function LeftSide({
  loading,
  selectConversation,
  userList,
  conversation,
  setReciever,
}) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { user, token } = useAuth();

  const createConversation = async (value) => {
    const data = {
      participants: [value, user._id],
      senderId: user._id,
    };
    try {
      await axios.post('http://localhost:5000/conversations', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-4 border-b">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <IoMdMenu size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-4">
            {/* Profile Section */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start"
              >
                <Avatar>
                  <AvatarImage src={user.profilePic} alt="ProfileIcon.svg" />
                  <AvatarFallback>{user?.userName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">
                  {user?.userName || 'User'}
                </span>
              </Button>
            </div>

            {/* Navigation Section */}
            <div className="space-y-2 border-t pt-2">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start"
              >
                <MdOutlineBookmarkAdded />
                <span>Saved Messages</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start"
              >
                <MdOutlineContacts />
                <span>Contacts</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start"
              >
                <MdOutlineSettings />
                <span>Settings</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start"
              >
                <IoMdHelp />
                <span>Help</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <SearchTab
          userList={userList}
          createConversation={createConversation}
          setReciever={setReciever}
        />
      </header>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <Chats
          setReciever={setReciever}
          contacts={conversation}
          setSelectedConversation={setSelectedConversation}
          selectConversation={selectConversation}
          loading={loading}
          selectedConversation={selectedConversation}
        />
      </div>
    </div>
  );
}
