"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { getCurrentUser } from "@/api/auth";
import { api } from "@/api/instance";
import { Button, Field, Input, Select } from "@/components/ui";
import { AvatarEditor } from "./_components/AvatarEditor";
import styles from "./page.module.css";

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
}

const PROFILE_TYPE = {
  OOO: "Юридическое лицо",
  INDIVIDUAL: "Физическое лицо",
};

interface FormValues {
  fullName: string;
  phoneNumber: string;
  profileType: string;
  isAnswersCall: boolean;
}

const schema = z.object({
  fullName: z.string().trim().min(1, "Введите имя"),
  phoneNumber: z
    .string()
    .regex(/^(\+7|8)?\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/, "Неверный формат номера телефона"),
  profileType: z.string().trim(),
  isAnswersCall: z.boolean(),
});

const ProfileSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      profileType: "INDIVIDUAL",
      isAnswersCall: false,
    },
  });

  const { data: profileData, isLoading: loading } = useQuery<ProfileSettings>({
    queryFn: getCurrentUser,
    queryKey: ["currentUser"],
  });

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    try {
      return URL.createObjectURL(selectedFile);
    } catch {
      return null;
    }
  }, [selectedFile]);

  const photoSrc = useMemo(() => {
    const p = profileData?.photo;
    if (!p) return null;
    const trimmed = String(p).trim();
    if (!trimmed) return null;

    // Пытаемся построить URL; разрешаем относительные URL, используя window.location как базу
    try {
      const base = typeof window !== "undefined" ? window.location.href : "http://localhost";
      const _ = new URL(trimmed, base);
      return trimmed;
    } catch {
      try {
        const encoded = encodeURI(trimmed);
        const _2 = new URL(
          encoded,
          typeof window !== "undefined" ? window.location.href : "http://localhost",
        );
        return encoded;
      } catch {
        return null;
      }
    }
  }, [profileData?.photo]);

  useEffect(() => {
    if (profileData)
      reset({
        fullName: profileData.fullName || "",
        phoneNumber: profileData.phoneNumber || "",
        profileType: profileData.profileType || "INDIVIDUAL",
        isAnswersCall: Boolean(profileData.isAnswersCall),
      });
  }, [profileData, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    };
  }, [previewUrl, rawImageUrl]);

  if (loading) return <div>Загрузка настроек...</div>;
  if (!profileData) return <div>Не удалось загрузить настройки</div>;

  const profileTypeValue = watch("profileType");
  const isAnswersCallValue = watch("isAnswersCall");

  const handleSave = handleSubmit(async (data) => {
    try {
      setSaving(true);
      if (selectedFile) {
        const fd = new FormData();
        fd.append("photo", selectedFile);
        fd.append("fullName", data.fullName || "");
        fd.append("phoneNumber", data.phoneNumber || "");
        fd.append("isAnswersCall", String(data.isAnswersCall));
        fd.append("profileType", data.profileType || "");

        await api("/user/update-settings", { method: "PATCH", body: data });
      } else {
        const fd = new FormData();
        fd.append("fullName", data.fullName || "");
        fd.append("phoneNumber", data.phoneNumber || "");
        fd.append("isAnswersCall", String(data.isAnswersCall));
        fd.append("profileType", data.profileType || "");

        await api("/user/update-settings", { method: "PATCH", body: data });
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      toast.error("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRawImageUrl(URL.createObjectURL(file));
      setShowEditor(true);
    }
  };

  const handleEditorSave = (blob: Blob) => {
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    setSelectedFile(file);
    setShowEditor(false);

    if (rawImageUrl) {
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    if (rawImageUrl) {
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <form className={styles.settings} onSubmit={handleSave}>
      <h1 className={styles.settingsLabel}>Настройки профиля</h1>

      <div className={styles.avatarPreview}>
        <div className={styles.avatarWrapper}>
          {previewUrl || photoSrc ? (
            <Image fill alt="avatar" className={styles.avatar} src={previewUrl || photoSrc!} />
          ) : (
            <div className={styles.avatarEmpty} />
          )}
        </div>
        <Field>
          <input
            ref={inputRef}
            accept="image/*"
            className={styles.avatarInput}
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
        </Field>
      </div>

      {showEditor && rawImageUrl && (
        <AvatarEditor image={rawImageUrl} onCancel={handleEditorCancel} onSave={handleEditorSave} />
      )}

      <Field>
        <Field.Label htmlFor="fullName">ФИО</Field.Label>
        <Input id="fullName" {...register("fullName")} />
        <Field.Error>{errors.fullName?.message}</Field.Error>
      </Field>

      <Field>
        <Field.Label htmlFor="phoneNumber">Номер телефона</Field.Label>
        <Input id="phoneNumber" {...register("phoneNumber")} />
        <Field.Error>{errors.phoneNumber?.message}</Field.Error>
      </Field>

      <fieldset className={styles.fieldsetWrapper}>
        <legend className={styles.label}>Отвечаете ли вы на звонки?</legend>
        <div className={styles.radioGroup}>
          <label className={styles.horizontalLabel}>
            <input
              checked={isAnswersCallValue === false}
              name="answersCall"
              type="radio"
              value="false"
              onChange={() =>
                setValue("isAnswersCall", false, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
            <span>Нет</span>
          </label>
          <label className={styles.horizontalLabel}>
            <input
              checked={isAnswersCallValue === true}
              name="answersCall"
              type="radio"
              value="true"
              onChange={() =>
                setValue("isAnswersCall", true, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
            <span>Да</span>
          </label>
        </div>
        <Field.Error>{errors.isAnswersCall?.message}</Field.Error>
      </fieldset>

      <Field>
        <Field.Label htmlFor="profileType">Тип профиля</Field.Label>
        <Select
          id="profileType"
          value={profileTypeValue}
          onValueChange={(value) =>
            setValue("profileType", value || "", {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        >
          <Select.Trigger>
            <Select.Value>
              {PROFILE_TYPE[profileTypeValue as keyof typeof PROFILE_TYPE]}
            </Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={"OOO"}>Юридическое лицо</Select.Item>
            <Select.Item value={"INDIVIDUAL"}>Физическое лицо</Select.Item>
          </Select.Content>
        </Select>
        <Field.Error>{errors.profileType?.message}</Field.Error>
      </Field>

      <div>
        <Button disabled={saving} type="submit">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsPage;
