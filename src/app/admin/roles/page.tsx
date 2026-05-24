"use client";

import type { User } from "@/types";
import type { AdminRole } from "@/api/requests";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { findAllUsers, setUserRole } from "@/api/requests";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import { MobileHeader } from "../_components/admin-sidebar";

const roleOptions: { value: AdminRole; label: string }[] = [
  { value: "USER", label: "Пользователь" },
  { value: "USER_VERIFIED", label: "Пользователь (верифицированный)" },
  { value: "SENIOR_MODERATOR", label: "Старший модератор" },
  { value: "ADMIN", label: "Администратор" },
  { value: "SUPERADMIN", label: "Суперадмин" },
];

const roleLabel: Record<AdminRole, string> = {
  USER: "Пользователь",
  USER_VERIFIED: "Пользователь (верифицированный)",
  SENIOR_MODERATOR: "Старший модератор",
  ADMIN: "Администратор",
  SUPERADMIN: "Суперадмин",
};

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRoles, setPendingRoles] = useState<Record<number, AdminRole>>({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: findAllUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: AdminRole }) => setUserRole(id, role),
    onSuccess: (_, variables) => {
      toast.success(`Роль пользователя #${variables.id} обновлена`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Не удалось обновить роль пользователя");
    },
  });

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const sorted = [...users].sort((a, b) => b.id - a.id);
    if (!query) return sorted;

    return sorted.filter((user: User) => {
      return (
        user.id.toString().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phoneNumber.includes(query)
      );
    });
  }, [users, searchQuery]);

  const getRole = (user: User): AdminRole =>
    (pendingRoles[user.id] || (user.role as AdminRole) || "USER") as AdminRole;

  const saveRole = (userId: number) => {
    const role = pendingRoles[userId];
    if (!role) return;
    roleMutation.mutate({ id: userId, role });
  };

  return (
    <div>
      <MobileHeader title="Роли и права" />
      <div className="mb-6">
        <Typography variant="h1" className="text-xl font-bold sm:text-2xl">
          Управление ролями
        </Typography>
        <Typography className="mt-1 text-gray-600">
          Назначение ролей и прав доступа пользователям
        </Typography>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Поиск по ID, ФИО, Email, телефону</label>
        <Input
          placeholder="Введите ID, ФИО, Email или телефон..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-semibold">ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Пользователь</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Контакт</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Текущая роль</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Новая роль</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Действие</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-3 py-6 text-sm text-gray-600" colSpan={6}>
                  Загрузка...
                </td>
              </tr>
            )}
            {!isLoading && filteredUsers.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-sm text-gray-600" colSpan={6}>
                  Пользователи не найдены
                </td>
              </tr>
            )}
            {!isLoading &&
              filteredUsers.map((user: User) => {
                const currentRole = (user.role as AdminRole) || "USER";
                const selectedRole = getRole(user);
                const isDirty = selectedRole !== currentRole;

                return (
                  <tr key={user.id} className="border-b">
                    <td className="px-3 py-2 text-xs">{user.id}</td>
                    <td className="px-3 py-2 text-xs">
                      <div className="font-medium">{user.fullName}</div>
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <div>{user.email || "—"}</div>
                      <div className="text-gray-500">{user.phoneNumber || "—"}</div>
                    </td>
                    <td className="px-3 py-2 text-xs">{roleLabel[currentRole] || currentRole}</td>
                    <td className="px-3 py-2 text-xs">
                      <select
                        className="w-full min-w-[220px] rounded-md border border-gray-300 px-3 py-2"
                        value={selectedRole}
                        onChange={(e) =>
                          setPendingRoles((prev) => ({
                            ...prev,
                            [user.id]: e.target.value as AdminRole,
                          }))
                        }
                      >
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <Button
                        disabled={!isDirty || roleMutation.isPending}
                        variant="success"
                        onClick={() => saveRole(user.id)}
                      >
                        Сохранить
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
