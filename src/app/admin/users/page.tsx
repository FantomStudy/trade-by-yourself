"use client";

import { useState } from "react";

import { Typography } from "@/components/ui";
import { Input } from "@/components/ui-lab/Input";

import { MobileHeader } from "../_components/admin-sidebar";
import { UsersTable } from "./_components/users-table";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <MobileHeader title="Пользователи" />
      <div className="mb-6">
        <Typography variant="h1" className="text-xl font-bold sm:text-2xl">
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
