"use client";

import { useState } from "react";

import { Input, Typography } from "@/components/ui";

import { UsersTable } from "./_components/users-table";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography variant="h1" className="text-2xl font-bold">
          Управление пользователями
        </Typography>
        <Typography className="mt-1 text-gray-600">
          Просмотр и управление всеми пользователями системы
        </Typography>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Поиск по ID, ФИО, Email или Телефону
        </label>
        <Input
          placeholder="Введите ID, ФИО, Email или телефон..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-white">
        <UsersTable searchQuery={searchQuery} />
      </div>
    </div>
  );
}
