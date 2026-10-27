"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/instance";

import { toast } from "sonner";
import { AvatarEditor } from "./_components/avatar-editor";

interface ProfileSettings {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: string;
  photo: string | null;
  rating: number | null;
  isAnswersCall: boolean;
  role?: string;
  companyName?: string;
  inn?: string;
  ogrn?: string;
  legalAddress?: string;
}

const ProfileSettingsPage = () => {
  const [data, setData] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    try {
      return URL.createObjectURL(selectedFile);
    } catch {
      return null;
    }
  }, [selectedFile]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api<ProfileSettings>("/auth/me");
        // Загружаем локально сохранённые реквизиты компании, если есть
        let companyExtras = {};
        try {
          const saved = localStorage.getItem(`legal_entity_${res.id}`);
          if (saved) {
            companyExtras = JSON.parse(saved);
          }
        } catch {}
        setData({ ...res, ...companyExtras });
      } catch (err) {
        console.error("Failed to load profile settings:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (key: keyof ProfileSettings, value: any) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      // Backend reads ONLY FormValue — always send multipart/form-data
      const fd = new FormData();
      fd.append("fullName", data.fullName || "");
      fd.append("phoneNumber", data.phoneNumber || "");
      fd.append("email", data.email || "");
      fd.append("isAnswersCall", String(data.isAnswersCall));
      fd.append("profileType", data.profileType || "");
      if (selectedFile) {
        fd.append("photo", selectedFile);
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-settings`, {
        method: "PATCH",
        credentials: "include",
        body: fd,
      });

      // Сохраняем реквизиты организации локально для отображения
      if (data.id) {
        try {
          localStorage.setItem(
            `legal_entity_${data.id}`,
            JSON.stringify({
              companyName: data.companyName || "",
              inn: data.inn || "",
              ogrn: data.ogrn || "",
              legalAddress: data.legalAddress || "",
            })
          );
        } catch {}
      }

      // Reload profile from server to confirm saved values
      const fresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });
      if (fresh.ok) {
        const freshData = await fresh.json();
        setData((prev) => ({ ...freshData, companyName: prev?.companyName, inn: prev?.inn, ogrn: prev?.ogrn, legalAddress: prev?.legalAddress }));
      }
      setSelectedFile(null);
      toast.success("Настройки профиля успешно сохранены!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Не удалось сохранить профиль");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const url = previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [previewUrl]);

  useEffect(() => {
    const url = rawImageUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [rawImageUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      // Open editor with the raw image
      const url = URL.createObjectURL(f);
      setRawImageUrl(url);
      setShowEditor(true);
    }
  };

  const handleEditorSave = (blob: Blob) => {
    // Convert blob to File
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    setSelectedFile(file);
    setShowEditor(false);

    // Cleanup raw image URL
    if (rawImageUrl) {
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);

    // Cleanup raw image URL
    if (rawImageUrl) {
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
    }

    // Clear file input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const photoSrc = useMemo(() => {
    const p = data?.photo;
    if (!p) return null;
    let trimmed = String(p).trim();
    if (!trimmed) return null;

    // Fix: If it's already an absolute URL (starts with https://), 
    // it might have been incorrectly prepended with API URL.
    // Let's strip the API prefix if found within the string,
    // but only if it's already an absolute URL.
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://torguisam.ru/api";
    if (trimmed.startsWith("https://") && trimmed.includes(apiBase)) {
        trimmed = trimmed.replace(apiBase, "");
    }

    return trimmed;
  }, [data?.photo]);

  if (loading) return <div>Загрузка настроек...</div>;
  if (!data) return <div>Не удалось загрузить настройки</div>;

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <h1 className="text-2xl font-bold">Настройки профиля</h1>

      <div className="flex items-center gap-6">
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100">
          {previewUrl || photoSrc ? (
            <Image fill alt="avatar" className="object-cover" src={previewUrl ?? photoSrc!} />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Изменить фото профиля
          </Button>
        </div>
      </div>

      {showEditor && rawImageUrl && (
        <AvatarEditor image={rawImageUrl} onCancel={handleEditorCancel} onSave={handleEditorSave} />
      )}

      <div>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="fullName">
          ФИО
        </label>
        <Input
          className="bg-white"
          id="fullName"
          value={data.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="phoneNumber">
          Номер телефона
        </label>
        <Input
          className="bg-white"
          id="phoneNumber"
          value={data.phoneNumber || ""}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="email">
          Электронная почта
        </label>
        <Input
          className="bg-white"
          id="email"
          type="email"
          value={data.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="user@example.com"
        />
        <p className="mt-1 text-xs text-gray-500">
          На этот адрес направляются чеки, уведомления по сделкам и системные отчёты.
        </p>
      </div>

      <fieldset className="mb-4">
        <legend className="mb-1 block text-sm text-gray-600">Отвечаете ли вы на звонки?</legend>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              checked={data.isAnswersCall === false}
              name="answersCall"
              type="radio"
              value="false"
              onChange={() => handleChange("isAnswersCall", false)}
            />
            <span>Нет</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              checked={data.isAnswersCall === true}
              name="answersCall"
              type="radio"
              value="true"
              onChange={() => handleChange("isAnswersCall", true)}
            />
            <span>Да</span>
          </label>
        </div>
      </fieldset>

      <div>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="profileType">
          Тип профиля
        </label>
        <select
          className="w-full rounded bg-gray-50 p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          id="profileType"
          value={data.profileType}
          onChange={(e) => handleChange("profileType", e.target.value)}
        >
          <option value="INDIVIDUAL">Физическое лицо</option>
          <option value="OOO">Юридическое лицо (ООО, ИП)</option>
        </select>
      </div>

      {data.profileType === "OOO" && (
        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
              Юр. лицо
            </span>
            <h3 className="font-semibold text-gray-900">Реквизиты организации</h3>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600" htmlFor="companyName">
              Наименование организации / ИП
            </label>
            <Input
              className="bg-white"
              id="companyName"
              value={data.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="ООО «МедСнаб» или ИП Иванов И.И."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-600" htmlFor="inn">
                ИНН
              </label>
              <Input
                className="bg-white"
                id="inn"
                value={data.inn || ""}
                onChange={(e) => handleChange("inn", e.target.value)}
                placeholder="10 или 12 цифр"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600" htmlFor="ogrn">
                ОГРН / ОГРНИП
              </label>
              <Input
                className="bg-white"
                id="ogrn"
                value={data.ogrn || ""}
                onChange={(e) => handleChange("ogrn", e.target.value)}
                placeholder="13 или 15 цифр"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600" htmlFor="legalAddress">
              Юридический адрес
            </label>
            <Input
              className="bg-white"
              id="legalAddress"
              value={data.legalAddress || ""}
              onChange={(e) => handleChange("legalAddress", e.target.value)}
              placeholder="г. Москва, ул. Ленина, д. 1"
            />
          </div>
        </div>
      )}

      <div>
        <Button disabled={saving} type="submit">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsPage;
