import { useAuth } from '@/utils/Auth';

export default function Message({ message }) {
  const { user } = useAuth();
  const isMe = message?.senderId === user._id;

  return (
    <div
      className={`flex w-full mb-2 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[75%] break-words px-4 py-2 rounded-lg shadow-md transition-all text-sm
          ${
            isMe
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
      >
        <p>{message?.content}</p>
      </div>
    </div>
  );
}
