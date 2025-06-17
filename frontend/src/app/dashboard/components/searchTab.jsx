import { useState } from 'react';
import Contactcard from './contactCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

export default function SearchTab({ userList, createConversation }) {
  const [selected, setSelected] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [input, setInput] = useState('');

  const handleSearch = async (e) => {
    const searchRes = userList.filter((el) => el.userName.includes(e));

    setSearchResult(searchRes);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };
  return (
    <div>
      <Command>
        <Popover>
          <PopoverTrigger asChild>
            <Button>search</Button>
          </PopoverTrigger>
          <PopoverContent>
            <CommandInput
              placeholder="search"
              onValueChange={(e) => handleSearch(e)}
            />
            <CommandEmpty>No results found</CommandEmpty>
            <CommandList>
              {searchResult && searchResult.length > 0
                ? searchResult.map((user) => {
                    return (
                      <CommandItem key={user._id}>
                        <Contactcard
                          clickedUser={user}
                          selected={selected}
                          createConversation={createConversation}
                        />
                      </CommandItem>
                    );
                  })
                : null}
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  );
}
