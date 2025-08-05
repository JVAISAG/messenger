import { useCallback, useMemo, useState } from 'react';
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
import axios from 'axios';
import { useAuth } from '@/utils/Auth';
import debounce from 'lodash.debounce';
import api from '@/utils/axios';

export default function SearchTab({
  userList,
  createConversation,
  setReciever,
}) {
  const [selected, setSelected] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const { user, token } = useAuth();

  const handleSearch = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        console.log('value reset');
        setSearchResult([]);
        return;
      }

      const res = await api.get(`/user?search=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data.searchResult;
      setSearchResult(data);
    }, 300),
    [token]
  );

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
              onValueChange={(value) => handleSearch(value)}
            />
            <CommandEmpty>No results found</CommandEmpty>
            <CommandList>
              {searchResult && searchResult.length > 0
                ? searchResult?.map((res) => {
                    console.log('search down:', user);
                    return (
                      <CommandItem key={res._id} value={res.userName}>
                        <Contactcard
                          clickedUser={res._id}
                          selected={selected}
                          createConversation={createConversation}
                          setReciever={setReciever}
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
