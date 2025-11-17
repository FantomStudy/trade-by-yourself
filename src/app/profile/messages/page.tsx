"use client";

import Link from "next/link";

interface ChatPreview {
  id: string;
  lastMessage: string;
  productName: string;
  productPrice: string;
  sender: string;
  time: string;
  unread?: boolean;
}

const MessagesPage = () => {
  const chats: ChatPreview[] = [
    {
      id: "1",
      productName: "Медицинский халат б/у",
      productPrice: "3000 рублей",
      lastMessage: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "Виктор Земцев",
      time: "11.06.25, 11:44",
      unread: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сообщения</h1>

      <div className="space-y-2">
        {chats.map((chat) => (
          <Link
            href={`/profile/messages/${chat.id}`}
            key={chat.id}
            className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{chat.productName}</h3>
                <p className="text-sm text-blue-600">{chat.productPrice}</p>
              </div>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                ВЗ
              </div>
              <p className="flex-1 truncate text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  {chat.sender}:
                </span>{" "}
                {chat.lastMessage}
              </p>
              {chat.unread && (
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
