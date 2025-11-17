"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui";

interface Message {
  id: string;
  isRead?: boolean;
  sender: "other" | "user";
  text: string;
  time: string;
}

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

const ChatPage = ({ params: _params }: ChatPageProps) => {
  const [message, setMessage] = useState("");
  const [messages] = useState<Message[]>([
    {
      id: "1",
      text: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "other",
      time: "11.06.25, 10:45",
      isRead: true,
    },
    {
      id: "2",
      text: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "user",
      time: "11.06.25, 11:44",
      isRead: true,
    },
    {
      id: "3",
      text: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "other",
      time: "11.06.25, 10:45",
      isRead: true,
    },
    {
      id: "4",
      text: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "user",
      time: "11.06.25, 11:44",
      isRead: true,
    },
    {
      id: "5",
      text: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "other",
      time: "11.06.25, 10:45",
      isRead: true,
    },
    {
      id: "6",
      text: "Помогите решить не пришло зачисление в размере 5000 р.",
      sender: "user",
      time: "11.06.25, 11:44",
      isRead: false,
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Отправка сообщения:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-110px)] flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Хедер чата */}
      <div className="flex flex-shrink-0 items-center gap-4 border-b bg-white px-4 py-3">
        <Link href={"/profile/messages" as any}>
          <Button className="h-10 w-10 p-0" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-200" />
          <div>
            <h1 className="text-base font-semibold">Медицинский халат б/у</h1>
            <p className="text-sm text-blue-600">3000 рублей</p>
          </div>
        </div>

        <div className="ml-auto">
          <Button className="bg-blue-500 px-6 hover:bg-blue-600">
            Показать номер
          </Button>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[70%] flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              {/* Аватар и имя отправителя для чужих сообщений */}
              {msg.sender === "other" && (
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                    ВЗ
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Виктор Земцев
                  </span>
                </div>
              )}

              {/* Имя для своих сообщений */}
              {msg.sender === "user" && (
                <span className="mr-2 text-sm font-medium text-gray-700">
                  Николай Петров
                </span>
              )}

              {/* Сообщение */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.sender === "user"
                    ? "bg-blue-400 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>

              {/* Время и статус */}
              <div className="flex items-center gap-1 px-2 text-xs text-gray-500">
                <span>{msg.isRead ? "Просмотрено" : "Не просмотрено"}</span>
                <span>•</span>
                <span>{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end gap-3">
          <textarea
            className="flex-1 resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Сообщение"
            rows={1}
          />
          <Button
            className="h-12 w-12 rounded-full bg-blue-500 p-0 hover:bg-blue-600"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
