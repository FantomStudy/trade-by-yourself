"use client";

import type { Category } from "@/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCreateDraftMutation, useCreateProductMutation } from "@/api/hooks";
import { AddressMap, ImageUpload, Input, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/instance";

import styles from "./page.module.css";

const CreateProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "1",
    description: "",
    state: "",
    address: "",
    categoryId: "",
    subcategoryId: "",
    typeId: "",
    videoUrl: "",
  });

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const createProductMutation = useCreateProductMutation();
  const createDraftMutation = useCreateDraftMutation();

  useEffect(() => {
    api<Category[]>("/category/find-all").then((response) => {
      setCategories(response);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Р”Р»СЏ С‡РёСЃР»РѕРІС‹С… РїРѕР»РµР№ СЂР°Р·СЂРµС€Р°РµРј С‚РѕР»СЊРєРѕ С†РёС„СЂС‹
    if (name === "price" || name === "quantity") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStateChange = (state: string) => {
    setFormData((prev) => ({ ...prev, state }));
  };
  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitAttempted(true);

    // Р’Р°Р»РёРґР°С†РёСЏ
    if (
      !formData.name ||
      !formData.price ||
      !formData.quantity ||
      !formData.state ||
      !formData.categoryId ||
      !formData.subcategoryId ||
      !formData.typeId
    ) {
      setError("РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РІСЃРµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Р¦РµРЅР° РґРѕР»Р¶РЅР° Р±С‹С‚СЊ Р±РѕР»СЊС€Рµ РЅСѓР»СЏ");
      return;
    }

    const parsedQuantity = Number(formData.quantity || "1");
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0");
      return;
    }

    if (images.length === 0) {
      setError("Р”РѕР±Р°РІСЊС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРЅРѕ РёР·РѕР±СЂР°Р¶РµРЅРёРµ");
      return;
    }

    try {
      await createProductMutation.mutateAsync(
        {
          name: formData.name,
          price: Number(formData.price),
          quantity: parsedQuantity,
          state: formData.state as "NEW" | "USED",
          categoryId: Number(formData.categoryId),
          subcategoryId: Number(formData.subcategoryId),
          typeId: Number(formData.typeId),
          description: formData.description,
          address: formData.address,
          images,
          fieldValues,
          videoUrl: formData.videoUrl,
          ...(coordinates && {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          }),
        },
        {
          onSuccess: (data) => {
            console.log("РћР±СЉСЏРІР»РµРЅРёРµ СЃРѕР·РґР°РЅРѕ:", data);
            toast.success(
              "РўРѕРІР°СЂ РѕС‚РїСЂР°РІР»РµРЅ РЅР° РјРѕРґРµСЂР°С†РёСЋ. РџРѕСЃР»Рµ РїСЂРѕРІРµСЂРєРё РѕРЅ РїРѕСЏРІРёС‚СЃСЏ РІ РІР°С€РµРј СЃРїРёСЃРєРµ РѕР±СЉСЏРІР»РµРЅРёР№.",
            );
            setFormData({
              name: "",
              price: "",
              quantity: "1",
              description: "",
              state: "",
              address: "",
              categoryId: "",
              subcategoryId: "",
              typeId: "",
              videoUrl: "",
            });
            setFieldValues({});
            setImages([]);
            setCoordinates(null);
            setError(null);
          },
          onError: (error: any) => {
            console.error("РћС€РёР±РєР° СЃРѕР·РґР°РЅРёСЏ РѕР±СЉСЏРІР»РµРЅРёСЏ:", error);

            if (error.response?.status === 400) {
              const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "РћС€РёР±РєР° РІР°Р»РёРґР°С†РёРё РґР°РЅРЅС‹С…";
              const formattedMessage = Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage;
              setError(
                formattedMessage.includes("РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0")
                  ? "РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0"
                  : formattedMessage,
              );
            } else {
              setError(`РћС€РёР±РєР° РїСЂРё СЃРѕР·РґР°РЅРёРё РѕР±СЉСЏРІР»РµРЅРёСЏ: ${error.message || "РќРµРёР·РІРµСЃС‚РЅР°СЏ РѕС€РёР±РєР°"}`);
            }
          },
        },
      );
      router.replace("/profile/my-products");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /** Р§РµСЂРЅРѕРІРёРє: С‚Рµ Р¶Рµ РїРѕР»СЏ, РЅРѕ Р±РµР· РѕР±СЏР·Р°С‚РµР»СЊРЅС‹С… С„РѕС‚Рѕ (multipart РєР°Рє Сѓ create). */
  const handleSaveDraft = async () => {
    setError(null);

    try {
      const parsedPrice = formData.price.trim() ? Number(formData.price) : undefined;
      const parsedQuantity = formData.quantity.trim() ? Number(formData.quantity) : undefined;
      const normalizedFieldValues = Object.entries(fieldValues).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          const trimmed = value.trim();
          if (trimmed) acc[key] = trimmed;
          return acc;
        },
        {},
      );

      await createDraftMutation.mutateAsync(
        {
          ...(formData.name.trim() ? { name: formData.name.trim() } : {}),
          ...(typeof parsedPrice === "number" && Number.isFinite(parsedPrice)
            ? { price: parsedPrice }
            : {}),
          ...(typeof parsedQuantity === "number" &&
          Number.isFinite(parsedQuantity) &&
          parsedQuantity > 0
            ? { quantity: parsedQuantity }
            : {}),
          ...(formData.state ? { state: formData.state as "NEW" | "USED" } : {}),
          ...(formData.categoryId ? { categoryId: Number(formData.categoryId) } : {}),
          ...(formData.subcategoryId ? { subcategoryId: Number(formData.subcategoryId) } : {}),
          ...(formData.typeId ? { typeId: Number(formData.typeId) } : {}),
          ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
          ...(formData.address.trim() ? { address: formData.address.trim() } : {}),
          images: images.length > 0 ? images : undefined,
          ...(Object.keys(normalizedFieldValues).length > 0
            ? { fieldValues: normalizedFieldValues }
            : {}),
          ...(formData.videoUrl.trim() ? { videoUrl: formData.videoUrl.trim() } : {}),
          ...(coordinates && {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          }),
        },
        {
          onSuccess: () => {
            toast.success("Р§РµСЂРЅРѕРІРёРє СЃРѕС…СЂР°РЅС‘РЅ");
          },
          onError: (error: any) => {
            console.error("РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ С‡РµСЂРЅРѕРІРёРєР°:", error);
            if (error.response?.status === 400) {
              const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "РћС€РёР±РєР° РІР°Р»РёРґР°С†РёРё РґР°РЅРЅС‹С…";
              const formattedMessage = Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage;
              setError(
                formattedMessage.includes("РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0")
                  ? "РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0"
                  : formattedMessage,
              );
            } else {
              setError(`РћС€РёР±РєР°: ${error.message || "РќРµРёР·РІРµСЃС‚РЅР°СЏ РѕС€РёР±РєР°"}`);
            }
          },
        },
      );
      router.replace("/profile/my-products?tab=drafts");
    } catch (err) {
      console.error("Draft save error:", err);
    }
  };

  // РџРѕР»СѓС‡Р°РµРј РґРѕСЃС‚СѓРїРЅС‹Рµ РїРѕРґРєР°С‚РµРіРѕСЂРёРё
  const selectedCategory = categories.find((cat) => String(cat.id) === formData.categoryId);
  const availableSubcategories = selectedCategory?.subCategories || [];

  // РџРѕР»СѓС‡Р°РµРј РґРѕСЃС‚СѓРїРЅС‹Рµ С‚РёРїС‹ РїРѕРґРєР°С‚РµРіРѕСЂРёР№
  const selectedSubcategory = availableSubcategories.find(
    (sub) => String(sub.id) === formData.subcategoryId,
  );
  const availableTypes = selectedSubcategory?.subcategoryTypes || [];

  // РџРѕР»СѓС‡Р°РµРј РїРѕР»СЏ РґР»СЏ РІС‹Р±СЂР°РЅРЅРѕРіРѕ С‚РёРїР°
  const selectedType = availableTypes.find((type) => String(type.id) === formData.typeId);
  const fields = selectedType?.fields || [];
  const requiredValidation = {
    name: !formData.name.trim(),
    price: !formData.price.trim() || Number(formData.price) <= 0,
    quantity:
      !formData.quantity.trim() ||
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) < 1,
    state: !formData.state,
    categoryId: !formData.categoryId,
    subcategoryId: !formData.subcategoryId,
    typeId: !formData.typeId,
    images: images.length === 0,
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>РЎРѕР·РґР°РЅРёРµ РѕР±СЉСЏРІР»РµРЅРёСЏ</h1>
        <label className={styles.fieldLabel} htmlFor="name">
          РќР°Р·РІР°РЅРёРµ РѕР±СЉСЏРІР»РµРЅРёСЏ *
        </label>
        <Input
          required
          id="name"
          className={`bg-white ${submitAttempted && requiredValidation.name ? styles.invalidField : ""}`}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РѕР±СЉСЏРІР»РµРЅРёСЏ"
        />
        <label className={styles.fieldLabel} htmlFor="price">
          Р¦РµРЅР° *
        </label>
        <Input
          required
          id="price"
          className={`bg-white ${submitAttempted && requiredValidation.price ? styles.invalidField : ""}`}
          name="price"
          pattern="[0-9]*"
          type="text"
          value={formData.price}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="Р’РІРµРґРёС‚Рµ С†РµРЅСѓ"
        />
        <label className={styles.fieldLabel} htmlFor="quantity">
          РљРѕР»РёС‡РµСЃС‚РІРѕ *
        </label>
        <Input
          required
          id="quantity"
          className={`bg-white ${submitAttempted && requiredValidation.quantity ? styles.invalidField : ""}`}
          min={1}
          name="quantity"
          pattern="[0-9]*"
          type="text"
          value={formData.quantity}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="Р’РІРµРґРёС‚Рµ РєРѕР»РёС‡РµСЃС‚РІРѕ (С€С‚.)"
        />
        <label className={styles.fieldLabel} htmlFor="name">
          РћРїРёСЃР°РЅРёРµ С‚РѕРІР°СЂР°
        </label>
        <Textarea
          className="bg-white"
          maxLength={7000}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="РќР°РїРёС€РёС‚Рµ РѕРїРёСЃР°РЅРёРµ РґР»СЏ С‚РѕРІР°СЂР°"
          rows={5}
        />
        <p className={styles.fieldHint}>Бесплатно: до 2000 символов, платное: до 7000 символов</p>

        <p>РЎРѕСЃС‚РѕСЏРЅРёРµ С‚РѕРІР°СЂР° *</p>
        <div
          className={`${styles.checkboxes} ${submitAttempted && requiredValidation.state ? styles.invalidGroup : ""}`}
        >
          <div className={styles.box}>
            <input
              checked={formData.state === "NEW"}
              className={styles.checkbox}
              id="new"
              name="state"
              type="radio"
              onChange={() => handleStateChange("NEW")}
            />
            <label htmlFor="new">РќРѕРІРѕРµ</label>
          </div>
          <div className={styles.box}>
            <input
              checked={formData.state === "USED"}
              className={styles.checkbox}
              id="used"
              name="state"
              type="radio"
              onChange={() => handleStateChange("USED")}
            />
            <label htmlFor="used">Р‘/РЈ</label>
          </div>
        </div>

        <h1 className={styles.blue}>РљР°С‚РµРіРѕСЂРёСЏ</h1>
        <label className={styles.fieldLabel} htmlFor="categoryId">
          РљР°С‚РµРіРѕСЂРёСЏ *
        </label>
        <select
          required
          id="categoryId"
          className={`w-full rounded border border-gray-300 bg-white p-2 ${submitAttempted && requiredValidation.categoryId ? styles.invalidField : ""}`}
          name="categoryId"
          value={formData.categoryId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categoryId: e.target.value,
              subcategoryId: "",
              typeId: "",
            }))
          }
        >
          <option value="">Р’С‹Р±РµСЂРёС‚Рµ РєР°С‚РµРіРѕСЂРёСЋ</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className={styles.fieldLabel} htmlFor="subcategoryId">
          РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ *
        </label>
        <select
          required
          id="subcategoryId"
          className={`w-full rounded border border-gray-300 bg-white p-2 ${submitAttempted && requiredValidation.subcategoryId ? styles.invalidField : ""}`}
          disabled={!formData.categoryId}
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              subcategoryId: e.target.value,
              typeId: "",
            }))
          }
        >
          <option value="">Р’С‹Р±РµСЂРёС‚Рµ РїРѕРґРєР°С‚РµРіРѕСЂРёСЋ</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <label className={styles.fieldLabel} htmlFor="typeId">
          РўРёРї *
        </label>
        <select
          required
          id="typeId"
          className={`w-full rounded border border-gray-300 bg-white p-2 ${submitAttempted && requiredValidation.typeId ? styles.invalidField : ""}`}
          disabled={!formData.subcategoryId}
          name="typeId"
          value={formData.typeId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              typeId: e.target.value,
            }))
          }
        >
          <option value="">Р’С‹Р±РµСЂРёС‚Рµ С‚РёРї</option>
          {availableTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {fields.length > 0 && (
          <>
            <h1 className={styles.blue}>Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ</h1>
            {fields.map((field) => (
              <Input
                key={field.id}
                className="bg-white"
                value={fieldValues[field.id] || ""}
                onChange={(e) =>
                  setFieldValues((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
                placeholder={field.name}
              />
            ))}
          </>
        )}

        <h1 className={styles.green}>РџРѕРґСЂРѕР±РЅРѕСЃС‚Рё</h1>
      </div>

      <ImageUpload maxImages={15} onImagesChange={handleImagesChange} />
      <p className={styles.fieldHint}>Бесплатно: до 8 фото, платное: до 15 фото</p>
      {submitAttempted && requiredValidation.images ? (
        <div className={styles.invalidHint}>Р”РѕР±Р°РІСЊС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРЅРѕ РёР·РѕР±СЂР°Р¶РµРЅРёРµ</div>
      ) : null}

      {/* РџРѕР»Рµ РґР»СЏ СЃСЃС‹Р»РєРё РЅР° РІРёРґРµРѕ */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label className={styles.fieldLabel} htmlFor="videoUrl">
          РЎСЃС‹Р»РєР° РЅР° РІРёРґРµРѕ
        </label>
        <Input
          id="videoUrl"
          className="bg-white"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleInputChange}
          placeholder="РЎСЃС‹Р»РєР° РЅР° РІРёРґРµРѕ"
        />
      </div>

      <div className={styles.wrapper}>
        <h1 className={styles.orange}>РњРµСЃС‚РѕРїРѕР»РѕР¶РµРЅРёРµ</h1>
        <AddressMap
          value={formData.address}
          onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
          onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          className={styles.button}
          disabled={createProductMutation.isPending || createDraftMutation.isPending}
          type="submit"
        >
          {createProductMutation.isPending ? "РЎРѕР·РґР°РЅРёРµ..." : "РЎРѕР·РґР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ"}
        </Button>
        <Button
          className={styles.button}
          disabled={createProductMutation.isPending || createDraftMutation.isPending}
          type="button"
          variant="success"
          onClick={handleSaveDraft}
        >
          {createDraftMutation.isPending ? "РЎРѕС…СЂР°РЅРµРЅРёРµ..." : "РЎРѕС…СЂР°РЅРёС‚СЊ С‡РµСЂРЅРѕРІРёРє"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProductPage;



