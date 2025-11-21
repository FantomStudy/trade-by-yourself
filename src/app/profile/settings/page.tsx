"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button, Input } from "@/components/ui";
import { api } from "@/lib/api/instance";

interface ProfileSettings {
  id: number;
  fullName: string;
  isAnswersCall: boolean | null;
  phoneNumber: string | null;
  photo?: string | null;
  profileType: string;
}

const ProfileSettingsPage = () => {
  const [data, setData] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
        const res = await api<ProfileSettings>("/user/profile-settings");
        setData(res);
        console.log("Profile settings loaded:", res);
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
      // If a new photo file was selected, send multipart/form-data
      if (selectedFile) {
        const fd = new FormData();
        fd.append("photo", selectedFile);
        fd.append("fullName", data.fullName || "");
        fd.append("phoneNumber", data.phoneNumber || "");
        fd.append("isAnswersCall", String(data.isAnswersCall));
        fd.append("profileType", data.profileType || "");

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-settings`, {
          method: "PATCH",
          credentials: "include",
          body: fd,
        });
      } else {
        // Call API to save JSON when no file upload
        await api("/user/update-settings", { method: "PATCH", body: data });
      }
      console.log("Profile saved");
    } catch (err) {
      console.error("Save failed:", err);
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

  const photoSrc = useMemo(() => {
    const p = data?.photo;
    if (!p) return null;
    const trimmed = String(p).trim();
    if (!trimmed) return null;

    // Try to build a URL; allow relative URLs by using window.location as base
    try {
      const base =
        typeof window !== "undefined"
          ? window.location.href
          : "http://localhost";
      const _ = new URL(trimmed, base);
      return trimmed;
    } catch {
      try {
        const encoded = encodeURI(trimmed);
        const _2 = new URL(
          encoded,
          typeof window !== "undefined"
            ? window.location.href
            : "http://localhost",
        );
        return encoded;
      } catch {
        return null;
      }
    }
  }, [data?.photo]);

  if (loading) return <div>Загрузка настроек...</div>;
  if (!data) return <div>Не удалось загрузить настройки</div>;

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <h1 className="text-2xl font-bold">Настройки профиля</h1>

      <div className="flex items-center gap-6">
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100">
          {previewUrl || photoSrc ? (
            <Image
              fill
              alt="avatar"
              className="object-cover"
              src={previewUrl ?? photoSrc!}
            />
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
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (f) setSelectedFile(f);
            }}
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
        <label
          className="mb-1 block text-sm text-gray-600"
          htmlFor="phoneNumber"
        >
          Номер телефона
        </label>
        <Input
          className="bg-white"
          id="phoneNumber"
          value={data.phoneNumber || ""}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
      </div>

      <fieldset className="mb-4">
        <legend className="mb-1 block text-sm text-gray-600">
          Отвечаете ли вы на звонки?
        </legend>
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
        <label
          className="mb-1 block text-sm text-gray-600"
          htmlFor="profileType"
        >
          Тип профиля
        </label>
        <select
          className="w-full rounded border bg-white p-2"
          id="profileType"
          value={data.profileType}
          onChange={(e) => handleChange("profileType", e.target.value)}
        >
          <option value="INDIVIDUAL">Физическое лицо</option>
          <option value="OOO">Юридическое лицо</option>
        </select>
      </div>

      <div>
        <Button disabled={saving} type="submit">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsPage;
