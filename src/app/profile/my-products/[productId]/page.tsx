"use client";

import type { Category } from "@/types";
import type { ExtendedProduct } from "@/types/product";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useDeleteProductMutation,
  usePublishDraftMutation,
  useUpdateProductMutation,
} from "@/api/hooks";
import { getProductById } from "@/api/requests";
import { AddressMap, Input, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/instance";
import { getUploadErrorMessage, validateImageFiles } from "@/lib/media-validation";

import styles from "../../create-product/page.module.css";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const { productId } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [_coordinates, _setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const updateProductMutation = useUpdateProductMutation(Number(productId));
  const deleteProductMutation = useDeleteProductMutation();
  const publishDraftMutation = usePublishDraftMutation();

  // Р—Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ С‚РѕРІР°СЂР°
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          getProductById(Number(productId)),
          api<Category[]>("/category/find-all"),
        ]);

        setProduct(productData);
        setCategories(categoriesData);
        setExistingImages(productData.images || []);

        // Р—Р°РїРѕР»РЅСЏРµРј С„РѕСЂРјСѓ РґР°РЅРЅС‹РјРё С‚РѕРІР°СЂР°
        setFormData({
          name: productData.name,
          price: productData.price.toString(),
          quantity: String(productData.quantity ?? 1),
          description: productData.description || "",
          state: "NEW", // TODO: РґРѕР±Р°РІРёС‚СЊ state РІ ExtendedProduct
          address: productData.address,
          categoryId: String(productData.category?.id ?? ""),
          subcategoryId: String(productData.subCategory?.id ?? ""),
          videoUrl: productData.videoUrl || "",
          typeId: "",
        });

        // Р—Р°РїРѕР»РЅСЏРµРј fieldValues РµСЃР»Рё РѕРЅРё РµСЃС‚СЊ
        if (productData.fieldValues && Array.isArray(productData.fieldValues)) {
          const values: Record<string, string> = {};
          productData.fieldValues.forEach((field) => {
            const valueEntry = Object.entries(field).find(([key]) => key !== "id");
            if (!valueEntry) return;
            const [, value] = valueEntry;
            values[String(field.id)] = String(value);
          });
          setFieldValues(values);
        }

        const currentCategory = categoriesData.find((cat) => cat.id === productData.category?.id);
        const currentSubcategory = currentCategory?.subCategories.find(
          (sub) => sub.id === productData.subCategory?.id,
        );
        console.log(productData);
        
        const matchedType = currentSubcategory?.subcategoryTypes.find(
          (type) => type.name === productData.type?.name,
        );
        if (matchedType?.id) {
          setFormData((prev) => ({ ...prev, typeId: String(matchedType.id) }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С… С‚РѕРІР°СЂР°");
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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

  const handleImagesChange = async (newImages: File[]) => {
    const validationError = await validateImageFiles(newImages, {
      currentCount: existingImages.length + images.length,
      currentTotalBytes: images.reduce((sum, file) => sum + file.size, 0),
      maxFiles: 8,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    console.log("=== handleImagesChange CALLED ===");
    console.log("New images to add:", newImages.length);
    console.log(
      "New images details:",
      newImages.map((f) => ({ name: f.name, size: f.size })),
    );

    setImages((prev) => {
      console.log("Previous images count:", prev.length);
      console.log(
        "Previous images:",
        prev.map((f) => ({ name: f.name, size: f.size })),
      );
      const updated = [...prev, ...newImages];
      console.log("Updated images count:", updated.length);
      console.log(
        "Updated images:",
        updated.map((f) => ({ name: f.name, size: f.size })),
      );
      return updated;
    });

    console.log("Current existingImages count:", existingImages.length);
    console.log("Current mainImageIndex:", mainImageIndex);
    console.log("=== handleImagesChange END ===\n");
  };

  const getTotalImages = () => {
    return existingImages.length + images.length;
  };

  const setAsMainImage = (index: number) => {
    console.log("=== setAsMainImage CALLED ===");
    console.log("Clicked index:", index);
    console.log("Current mainImageIndex:", mainImageIndex);
    console.log("Existing images count:", existingImages.length);
    console.log("New images count:", images.length);
    console.log("Total images:", getTotalImages());

    setMainImageIndex(index);
    console.log("Set mainImageIndex to:", index);
    console.log("=== setAsMainImage END ===\n");
  };

  const removeImage = (index: number) => {
    console.log("=== removeImage CALLED ===");
    console.log("Index to remove:", index);
    console.log("Current mainImageIndex:", mainImageIndex);
    console.log("Existing images count BEFORE:", existingImages.length);
    console.log("Existing images:", existingImages);
    console.log("New images count BEFORE:", images.length);
    console.log(
      "New images:",
      images.map((f) => ({ name: f.name, size: f.size })),
    );

    const totalExisting = existingImages.length;
    console.log("totalExisting:", totalExisting);

    if (index < totalExisting) {
      console.log("Removing EXISTING image at index:", index);
      const newExisting = existingImages.filter((_, i) => i !== index);
      console.log("New existing count:", newExisting.length);
      setExistingImages(newExisting);
    } else {
      console.log("Removing NEW image");
      const newIndex = index - totalExisting;
      console.log("New image index in array:", newIndex);
      const newImages = images.filter((_, i) => i !== newIndex);
      console.log("New images count after filter:", newImages.length);
      console.log(
        "New images after filter:",
        newImages.map((f) => ({ name: f.name, size: f.size })),
      );
      setImages(newImages);
    }

    // РљРѕСЂСЂРµРєС‚РёСЂРѕРІРєР° РѕСЃРЅРѕРІРЅРѕРіРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
    const totalAfterRemove = getTotalImages() - 1;
    console.log("Total after remove:", totalAfterRemove);

    if (index === mainImageIndex && totalAfterRemove > 0) {
      console.log("Removed main image, setting to 0");
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      console.log("Removed image before main, decrementing mainImageIndex");
      setMainImageIndex(mainImageIndex - 1);
    } else if (mainImageIndex >= totalAfterRemove) {
      console.log("mainImageIndex out of bounds, adjusting");
      setMainImageIndex(Math.max(0, totalAfterRemove - 1));
    }
    console.log("=== removeImage END ===\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedPrice = formData.price.trim() ? Number(formData.price) : undefined;
    const parsedQuantity = formData.quantity.trim() ? Number(formData.quantity) : undefined;

    if (parsedPrice !== undefined && (!Number.isFinite(parsedPrice) || parsedPrice <= 0)) {
      setError("Р¦РµРЅР° РґРѕР»Р¶РЅР° Р±С‹С‚СЊ Р±РѕР»СЊС€Рµ РЅСѓР»СЏ");
      return;
    }

    if (
      parsedQuantity !== undefined &&
      (!Number.isFinite(parsedQuantity) || !Number.isInteger(parsedQuantity) || parsedQuantity < 1)
    ) {
      setError("РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0");
      return;
    }

    try {
      const resolvedCategoryId = Number(formData.categoryId || product?.category?.id || 0);
      const resolvedSubcategoryId = Number(formData.subcategoryId || product?.subCategory?.id || 0);

      // РџРµСЂРµСѓРїРѕСЂСЏРґРѕС‡РёРІР°РµРј РёР·РѕР±СЂР°Р¶РµРЅРёСЏ С‚Р°Рє, С‡С‚РѕР±С‹ РѕСЃРЅРѕРІРЅРѕРµ Р±С‹Р»Рѕ РїРµСЂРІС‹Рј
      let orderedImages = images;
      if (images.length > 0 && mainImageIndex >= existingImages.length) {
        // РћСЃРЅРѕРІРЅРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ - СЌС‚Рѕ РЅРѕРІРѕРµ С„РѕС‚Рѕ
        const newImageIndex = mainImageIndex - existingImages.length;
        orderedImages = [...images];
        const [mainImage] = orderedImages.splice(newImageIndex, 1);
        orderedImages = [mainImage, ...orderedImages];
        console.log(
          "Reordered new images, main at index 0:",
          orderedImages.map((f) => f.name),
        );
      }

      await updateProductMutation.mutateAsync(
        {
          ...(formData.name.trim() ? { name: formData.name.trim() } : {}),
          ...(parsedPrice !== undefined ? { price: parsedPrice } : {}),
          ...(parsedQuantity !== undefined ? { quantity: parsedQuantity } : {}),
          ...(formData.state ? { state: formData.state as "NEW" | "USED" } : {}),
          ...(resolvedCategoryId > 0 ? { categoryId: resolvedCategoryId } : {}),
          ...(resolvedSubcategoryId > 0 ? { subcategoryId: resolvedSubcategoryId } : {}),
          ...(formData.typeId ? { typeId: Number(formData.typeId) } : {}),
          ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
          ...(formData.address.trim() ? { address: formData.address.trim() } : {}),
          images: orderedImages.length > 0 ? orderedImages : undefined,
          fieldValues: Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
          ...(formData.videoUrl.trim() ? { videoUrl: formData.videoUrl.trim() } : {}),
        },
        {
          onSuccess: () => {
            router.push("/profile/my-products");
          },
          onError: (error: any) => {
            console.error("РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ РѕР±СЉСЏРІР»РµРЅРёСЏ:", error);
            const errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "РћС€РёР±РєР° РїСЂРё РѕР±РЅРѕРІР»РµРЅРёРё РѕР±СЉСЏРІР»РµРЅРёСЏ";
            const formattedMessage = Array.isArray(errorMessage)
              ? errorMessage.join(", ")
              : errorMessage;
            setError(
              formattedMessage.includes("РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0")
                ? "РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0"
                : getUploadErrorMessage(error, formattedMessage),
            );
          },
        },
      );
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleCreateFromDraft = async () => {
    setError(null);

    if (
      !formData.name.trim() ||
      !formData.price.trim() ||
      !formData.quantity.trim() ||
      !formData.state ||
      !formData.categoryId ||
      !formData.subcategoryId ||
      !formData.typeId
    ) {
      setError("РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РІСЃРµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ");
      return;
    }

    const parsedPrice = Number(formData.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Р¦РµРЅР° РґРѕР»Р¶РЅР° Р±С‹С‚СЊ Р±РѕР»СЊС€Рµ РЅСѓР»СЏ");
      return;
    }

    const parsedQuantity = Number(formData.quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("РљРѕР»РёС‡РµСЃС‚РІРѕ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј Р±РѕР»СЊС€Рµ 0");
      return;
    }

    if (getTotalImages() === 0) {
      setError("Р”РѕР±Р°РІСЊС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРЅРѕ РёР·РѕР±СЂР°Р¶РµРЅРёРµ");
      return;
    }

    try {
      // РЎРЅР°С‡Р°Р»Р° СЃРѕС…СЂР°РЅСЏРµРј Р°РєС‚СѓР°Р»СЊРЅС‹Рµ РїСЂР°РІРєРё РІ С‡РµСЂРЅРѕРІРёРє, Р·Р°С‚РµРј РїСѓР±Р»РёРєСѓРµРј.
      await updateProductMutation.mutateAsync({
        name: formData.name.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
        state: formData.state as "NEW" | "USED",
        categoryId: Number(formData.categoryId),
        subcategoryId: Number(formData.subcategoryId),
        typeId: Number(formData.typeId),
        description: formData.description.trim() || undefined,
        address: formData.address.trim() || undefined,
        images: images.length > 0 ? images : undefined,
        fieldValues: Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
        videoUrl: formData.videoUrl.trim() || undefined,
      });
      await publishDraftMutation.mutateAsync(Number(productId));
      toast.success("РћР±СЉСЏРІР»РµРЅРёРµ РѕС‚РїСЂР°РІР»РµРЅРѕ РЅР° РјРѕРґРµСЂР°С†РёСЋ");
      router.replace("/profile/my-products");
      router.refresh();
    } catch (err) {
      console.error("Publish from draft error:", err);
      setError("РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ РёР· С‡РµСЂРЅРѕРІРёРєР°");
    }
  };

  const _handleDelete = async () => {
    if (!confirm("Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ СѓРґР°Р»РёС‚СЊ СЌС‚Рѕ РѕР±СЉСЏРІР»РµРЅРёРµ?")) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(Number(productId), {
        onSuccess: () => {
          router.push("/profile/my-products");
        },
        onError: (error: any) => {
          console.error("РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ РѕР±СЉСЏРІР»РµРЅРёСЏ:", error);
          setError("РћС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё РѕР±СЉСЏРІР»РµРЅРёСЏ");
        },
      });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Р—Р°РіСЂСѓР·РєР°...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-red-500">РўРѕРІР°СЂ РЅРµ РЅР°Р№РґРµРЅ</div>
      </div>
    );
  }

  const selectedCategory = categories.find((cat) => String(cat.id) === formData.categoryId);
  const availableSubcategories = selectedCategory?.subCategories || [];
  const selectedSubcategory = availableSubcategories.find(
    (sub) => String(sub.id) === formData.subcategoryId,
  );
  const availableTypes = selectedSubcategory?.subcategoryTypes || [];
  const selectedType = availableTypes.find((type) => String(type.id) === formData.typeId);
  const dynamicFields = selectedType?.fields || [];

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>Р РµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ РѕР±СЉСЏРІР»РµРЅРёСЏ</h1>
        <Input
          required={product?.moderateState !== "DRAFT"}
          className="bg-white"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="РќР°Р·РІР°РЅРёРµ РѕР±СЉСЏРІР»РµРЅРёСЏ"
        />
        <Input
          required={product?.moderateState !== "DRAFT"}
          className="bg-white"
          name="price"
          pattern="[0-9]*"
          type="text"
          value={formData.price}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="Р¦РµРЅР°"
        />
        <Input
          required={product?.moderateState !== "DRAFT"}
          className="bg-white"
          min={1}
          name="quantity"
          pattern="[0-9]*"
          type="text"
          value={formData.quantity}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="РљРѕР»РёС‡РµСЃС‚РІРѕ (С€С‚.)"
        />
        <Textarea
          className="bg-white"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="РћРїРёСЃР°РЅРёРµ С‚РѕРІР°СЂР°"
          rows={5}
        />

        <p>Р’С‹Р±РµСЂРёС‚Рµ С‚РёРї С‚РѕРІР°СЂР° *</p>
        <div className={styles.checkboxes}>
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
        <select
          className="w-full rounded border border-gray-300 bg-white p-2"
          name="categoryId"
          value={formData.categoryId}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              categoryId: e.target.value,
              subcategoryId: "",
              typeId: "",
            }));
            setFieldValues({});
          }}
        >
          <option value="">Р’С‹Р±РµСЂРёС‚Рµ РєР°С‚РµРіРѕСЂРёСЋ</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded border border-gray-300 bg-white p-2"
          disabled={!formData.categoryId}
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, subcategoryId: e.target.value, typeId: "" }));
            setFieldValues({});
          }}
        >
          <option value="">Р’С‹Р±РµСЂРёС‚Рµ РїРѕРґРєР°С‚РµРіРѕСЂРёСЋ</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded border border-gray-300 bg-white p-2"
          disabled={!formData.subcategoryId}
          name="typeId"
          value={formData.typeId}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, typeId: e.target.value }));
            setFieldValues({});
          }}
        >
          <option value="">Р’С‹Р±РµСЂРёС‚Рµ С‚РёРї</option>
          {availableTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {dynamicFields.length > 0 &&
          dynamicFields.map((field) => (
            <Input
              key={field.id}
              className="bg-white"
              value={fieldValues[String(field.id)] || ""}
              onChange={(e) =>
                setFieldValues((prev) => ({
                  ...prev,
                  [String(field.id)]: e.target.value,
                }))
              }
              placeholder={field.name}
            />
          ))}

        <h1 className={styles.green}>РџРѕРґСЂРѕР±РЅРѕСЃС‚Рё</h1>
        <div className="flex flex-wrap gap-3">
          {/* РЎСѓС‰РµСЃС‚РІСѓСЋС‰РёРµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ */}
          {existingImages.map((img, idx) => {
            const globalIndex = idx;
            return (
              <div
                key={`existing-${img}-${idx}`}
                className={`relative h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-xl border-2 transition-colors md:h-[200px] md:w-[200px] ${
                  globalIndex === mainImageIndex
                    ? "border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                    : "border-transparent hover:border-blue-500"
                }`}
                tabIndex={0}
                onClick={() => setAsMainImage(globalIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAsMainImage(globalIndex);
                  }
                }}
                role="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Р¤РѕС‚Рѕ ${idx + 1}`}
                  className="h-full w-full rounded-xl object-cover"
                  src={img}
                />
                <button
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-xs text-white hover:bg-red-600/90"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(globalIndex);
                  }}
                >
                  рџ—‘пёЏ
                </button>
                {globalIndex === mainImageIndex && (
                  <div className="absolute bottom-2 left-2 z-10 rounded bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                    РћСЃРЅРѕРІРЅРѕРµ
                  </div>
                )}
              </div>
            );
          })}
          {/* РќРѕРІС‹Рµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ */}
          {images.map((img, idx) => {
            const globalIndex = existingImages.length + idx;
            const uniqueKey = `new-${globalIndex}-${img.name}-${img.size}-${img.lastModified}`;
            return (
              <div
                key={uniqueKey}
                className={`relative h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-xl border-2 transition-colors md:h-[200px] md:w-[200px] ${
                  globalIndex === mainImageIndex
                    ? "border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                    : "border-blue-400 hover:border-blue-500"
                }`}
                tabIndex={0}
                onClick={() => setAsMainImage(globalIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAsMainImage(globalIndex);
                  }
                }}
                role="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`РќРѕРІРѕРµ С„РѕС‚Рѕ ${idx + 1}`}
                  className="h-full w-full rounded-xl object-cover"
                  src={URL.createObjectURL(img)}
                />
                <button
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-xs text-white hover:bg-red-600/90"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(globalIndex);
                  }}
                >
                  рџ—‘пёЏ
                </button>
                {globalIndex === mainImageIndex && (
                  <div className="absolute bottom-2 left-2 z-10 rounded bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                    РћСЃРЅРѕРІРЅРѕРµ
                  </div>
                )}
                <div className="absolute right-2 bottom-2 z-10 rounded bg-blue-500/90 px-2 py-1 text-xs font-medium text-white">
                  РќРѕРІРѕРµ
                </div>
              </div>
            );
          })}
          {/* РљРЅРѕРїРєР° РґРѕР±Р°РІР»РµРЅРёСЏ С„РѕС‚Рѕ */}
          {getTotalImages() < 8 && (
            <div
              className="flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 md:h-[200px] md:w-[200px]"
              tabIndex={0}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.multiple = true;
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || []);
                  if (files.length > 0) {
                    handleImagesChange(files);
                  }
                };
                input.click();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.multiple = true;
                  input.onchange = (ev) => {
                    const files = Array.from((ev.target as HTMLInputElement).files || []);
                    if (files.length > 0) {
                      handleImagesChange(files);
                    }
                  };
                  input.click();
                }
              }}
              role="button"
            >
              <div className="text-4xl text-gray-400 md:text-5xl">рџ“·</div>
              <span className="text-center text-xs font-medium text-gray-500 md:text-sm">
                Р”РѕР±Р°РІРёС‚СЊ С„РѕС‚Рѕ
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Input
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
          onCoordinatesChange={(lat, lng) => _setCoordinates({ lat, lng })}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.wrapper}>
        <div className="flex gap-4">
          <Button
            className={styles.button}
            disabled={updateProductMutation.isPending || publishDraftMutation.isPending}
            type="submit"
          >
            {updateProductMutation.isPending ? "РЎРѕС…СЂР°РЅРµРЅРёРµ..." : "РЎРѕС…СЂР°РЅРёС‚СЊ РёР·РјРµРЅРµРЅРёСЏ"}
          </Button>
          <Button
            className={styles.button}
            disabled={updateProductMutation.isPending || publishDraftMutation.isPending}
            type="button"
            variant="success"
            onClick={handleCreateFromDraft}
          >
            {publishDraftMutation.isPending ? "РЎРѕР·РґР°РЅРёРµ..." : "РЎРѕР·РґР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditProductPage;

