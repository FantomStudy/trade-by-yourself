"use client";

import type { User } from "@/types";

import { useState } from "react";

import { Button, Input, Typography } from "@/components/ui";
import { setUserBalance } from "@/lib/api";

interface UsersTableProps {
  users: User[];
  onBalanceUpdate: () => void;
}

export const UsersTable = ({ users, onBalanceUpdate }: UsersTableProps) => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.id.toString().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.toLowerCase().includes(query) ||
      (user.profileType === "INDIVIDUAL"
        ? "частное лицо"
        : "компания"
      ).includes(query)
    );
  });

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setNewBalance(user.balance.toString());
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setNewBalance("");
  };

  const handleSave = async (userId: number) => {
    try {
      setIsLoading(true);
      const balance = Number.parseFloat(newBalance);
      if (isNaN(balance)) {
        alert("Некорректное значение баланса");
        return;
      }
      await setUserBalance(userId, balance);
      setEditingUserId(null);
      setNewBalance("");
      onBalanceUpdate();
    } catch (error) {
      console.error("Ошибка при обновлении баланса:", error);
      alert("Не удалось обновить баланс");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Input
          className="max-w-md"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по ID, имени, email, телефону..."
        />
      </div>

      <div className="max-h-[calc(100vh-280px)] max-w-[calc(100%-100px)] overflow-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6">
                ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6">
                ФИО
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6 lg:table-cell">
                Email
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6 xl:table-cell">
                Телефон
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:table-cell md:px-6">
                Тип профиля
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6 lg:table-cell">
                Рейтинг
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6">
                Баланс
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:px-6">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900 md:px-6">
                  {user.id}
                </td>
                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900 md:px-6">
                  <div className="flex flex-col">
                    <span>{user.fullName}</span>
                    <span className="text-xs text-gray-500 lg:hidden">
                      {user.email}
                    </span>
                    <span className="text-xs text-gray-500 sm:hidden lg:block xl:hidden">
                      {user.phoneNumber}
                    </span>
                  </div>
                </td>
                <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 md:px-6 lg:table-cell">
                  {user.email}
                </td>
                <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 md:px-6 xl:table-cell">
                  {user.phoneNumber}
                </td>
                <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell md:px-6">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                      user.profileType === "INDIVIDUAL"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.profileType === "INDIVIDUAL"
                      ? "Частное лицо"
                      : "Компания"}
                  </span>
                </td>
                <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 md:px-6 lg:table-cell">
                  {user.rating !== null ? user.rating.toFixed(1) : "—"}
                </td>
                <td className="px-3 py-4 text-sm whitespace-nowrap md:px-6">
                  {editingUserId === user.id ? (
                    <Input
                      className="w-20 md:w-24"
                      disabled={isLoading}
                      step="0.01"
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                    />
                  ) : (
                    <span className="font-medium text-gray-900">
                      {user.balance.toFixed(2)} ₽
                    </span>
                  )}
                </td>
                <td className="px-3 py-4 text-sm whitespace-nowrap md:px-6">
                  {editingUserId === user.id ? (
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                      <Button
                        disabled={isLoading}
                        variant="default"
                        onClick={() => handleSave(user.id)}
                      >
                        {isLoading ? "..." : "Сохр."}
                      </Button>
                      <Button
                        disabled={isLoading}
                        variant="secondary"
                        onClick={handleCancel}
                      >
                        Отм.
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(user)}
                    >
                      Изм.
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Typography className="text-gray-500">
              {searchQuery
                ? "Пользователи не найдены"
                : "Пользователи не найдены"}
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};
