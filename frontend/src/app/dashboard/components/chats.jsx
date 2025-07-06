import { useAuth } from '@/utils/Auth';
import ContactCard from './contactCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Chats({
  contacts,
  setSelectedConversation,
  selectConversation,
  loading,
  setReciever,
  selectedConversation,
}) {
  const { user } = useAuth();
  return (
    <div className="h-full">
      <ScrollArea className="h-full px-3 py-2">
        <ul id="contacts-list" className="space-y-2">
          {contacts && contacts.length > 0
            ? contacts.map((conversation, index) => {
                const contactId = conversation.participants?.find(
                  (usr) => usr !== user._id
                );

                return (
                  <li
                    key={index}
                    onClick={() => {
                      setSelectedConversation(index);
                      selectConversation(conversation, true);
                    }}
                    className="transition hover:scale-[1.01] ease-in-out"
                  >
                    <ContactCard
                      clickedUser={contactId}
                      setReciever={setReciever}
                      selected={selectedConversation === index}
                      conversation={conversation}
                    />
                  </li>
                );
              })
            : null}
        </ul>
      </ScrollArea>
    </div>
  );
}
