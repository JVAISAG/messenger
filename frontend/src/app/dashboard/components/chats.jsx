import ContactCard from './contactCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Chats(
  contacts,
  setSelectedConversation,
  selectConversation,
  loading,

  selectedConversation
) {
  return (
    <div>
      <ScrollArea>
        <ul id="contacts-list">
          {!loading && contacts && contacts.length > 0
            ? contacts.map((contact, index) => {
                console.log('Index:', contact);
                const convo = { ...contact };
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setSelectedConversation(index);
                      selectConversation(contact, true);
                    }}
                  >
                    {
                      <ContactCard
                        contact={convo}
                        selected={selectedConversation === index}
                      />
                    }
                  </li>
                );
              })
            : null}
        </ul>
      </ScrollArea>
      {/* <Button variant="ghost">+</Button> */}
    </div>
  );
}
