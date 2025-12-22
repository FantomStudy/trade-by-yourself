"use client";

import type { UpdateUserDto } from "@/api/requests";
import type { User } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  deleteUser,
  findAllUsers,
  toggleUserBanned,
  updateUser,
} from "@/api/requests";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from "@/components/ui";

interface UsersTableProps {
  searchQuery: string;
}

export const UsersTable = ({ searchQuery }: UsersTableProps) => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserDto>({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: findAllUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      updateUser(id, data),
    onSuccess: () => {
      toast.success("Пользователь успешно обновлен");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error("Ошибка при обновлении пользователя");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success("Пользователь успешно удален");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error("Ошибка при удалении пользователя");
    },
  });

  const toggleBanMutation = useMutation({
    mutationFn: (id: number) => toggleUserBanned(id),
    onSuccess: () => {
      toast.success("Статус бана изменен");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Ошибка при изменении статуса бана");
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileType: user.profileType,
      balance: user.balance,
      bonusBalance: user.bonusBalance,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: editForm });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  const sortedUsers = [...users].sort((a, b) => b.id - a.id);

  const filteredUsers = sortedUsers.filter((user) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.id.toString().includes(searchQuery) ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.includes(searchQuery)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Typography>Загрузка...</Typography>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                ID
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                ФИО
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Email
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Телефон
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Тип
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Баланс
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Бонусы
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Товары
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Статус
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold whitespace-nowrap text-gray-700">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50"
                role="row"
              >
                <td className="px-2 py-2 text-xs text-gray-900">{user.id}</td>
                <td
                  className="max-w-[150px] truncate px-2 py-2 text-xs text-gray-900"
                  title={user.fullName}
                >
                  {user.fullName}
                </td>
                <td
                  className="max-w-[150px] truncate px-2 py-2 text-xs text-gray-900"
                  title={user.email}
                >
                  {user.email}
                </td>
                <td className="px-2 py-2 text-xs whitespace-nowrap text-gray-900">
                  {user.phoneNumber}
                </td>
                <td className="px-2 py-2 text-xs whitespace-nowrap text-gray-900">
                  {user.profileType === "INDIVIDUAL" ? "Физ лицо" : "Юр лицо"}
                </td>
                <td className="px-2 py-2 text-xs whitespace-nowrap text-gray-900">
                  ₽{user.balance.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-xs whitespace-nowrap text-gray-900">
                  ₽{(user.bonusBalance || 0).toFixed(2)}
                </td>
                <td className="px-2 py-2 text-center text-xs text-gray-900">
                  {user.products || 0}
                </td>
                <td className="px-2 py-2 text-xs">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                      user.isBanned
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBanned ? "Заблокирован" : "Активен"}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Button
                      title="Редактировать"
                      variant="secondary"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      title={user.isBanned ? "Разблокировать" : "Заблокировать"}
                      variant="secondary"
                      onClick={() => toggleBanMutation.mutate(user.id)}
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      title="Удалить"
                      variant="destructive"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
            <DialogDescription>
              Измените данные пользователя и сохраните изменения
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="fullName"
              >
                ФИО
              </label>
              <Input
                id="fullName"
                value={editForm.fullName || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="phoneNumber"
              >
                Телефон
              </label>
              <Input
                id="phoneNumber"
                value={editForm.phoneNumber || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="profileType"
              >
                Тип профиля
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                id="profileType"
                value={editForm.profileType || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, profileType: e.target.value })
                }
              >
                <option value="INDIVIDUAL">Физ лицо</option>
                <option value="OOO">Юр лицо</option>
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="balance"
              >
                Баланс
              </label>
              <Input
                id="balance"
                step="0.01"
                type="number"
                value={editForm.balance || 0}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    balance: Number.parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="bonusBalance"
              >
                Бонусный баланс
              </label>
              <Input
                id="bonusBalance"
                step="0.01"
                type="number"
                value={editForm.bonusBalance || 0}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    bonusBalance: Number.parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              disabled={updateMutation.isPending}
              onClick={handleSaveEdit}
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление пользователя</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить пользователя{" "}
              <strong>{selectedUser?.fullName}</strong>? Это действие нельзя
              отменить.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              disabled={deleteMutation.isPending}
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {deleteMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
