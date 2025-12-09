"use client";

import { ChevronDown, ChevronRight, Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, Input, Typography } from "@/components/ui";
import { api } from "@/lib/api/instance";

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface SubcategoryType {
  id: number;
  name: string;
  subcategoryId: number;
}

interface TypeField {
  id: number;
  name: string;
  typeId: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subcategoryTypes, setSubcategoryTypes] = useState<SubcategoryType[]>(
    [],
  );
  const [typeFields, setTypeFields] = useState<TypeField[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Set<number>
  >(new Set());
  const [expandedTypes, setExpandedTypes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Модальные окна для категорий
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

  // Модальные окна для подкатегорий
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [showEditSubcategory, setShowEditSubcategory] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  // Модальные окна для типов подкатегорий
  const [showAddSubcategoryType, setShowAddSubcategoryType] = useState(false);
  const [showEditSubcategoryType, setShowEditSubcategoryType] = useState(false);
  const [editingSubcategoryType, setEditingSubcategoryType] =
    useState<SubcategoryType | null>(null);
  const [subcategoryTypeName, setSubcategoryTypeName] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | null
  >(null);

  // Модальные окна для характеристик типов
  const [showAddTypeField, setShowAddTypeField] = useState(false);
  const [showEditTypeField, setShowEditTypeField] = useState(false);
  const [editingTypeField, setEditingTypeField] = useState<TypeField | null>(
    null,
  );
  const [typeFieldName, setTypeFieldName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [
        categoriesData,
        subcategoriesData,
        subcategoryTypesData,
        typeFieldsData,
      ] = await Promise.all([
        api<Category[]>("/category/find-all"),
        api<Subcategory[]>("/subcategory/find-all"),
        api<SubcategoryType[]>("/subcategory-type/find-all"),
        api<TypeField[]>("/type-field/find-all"),
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setSubcategoryTypes(subcategoryTypesData);
      setTypeFields(typeFieldsData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      toast.error("Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const toggleType = (typeId: number) => {
    setExpandedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(typeId)) {
        newSet.delete(typeId);
      } else {
        newSet.add(typeId);
      }
      return newSet;
    });
  };

  // Категории CRUD
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Введите название категории");
      return;
    }

    try {
      setIsSubmitting(true);
      await api("/category/create-category", {
        method: "POST",
        body: { name: categoryName },
      });
      toast.success("Категория создана");
      setShowAddCategory(false);
      setCategoryName("");
      loadData();
    } catch (error: any) {
      console.error("Ошибка создания категории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось создать категорию";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) {
      toast.error("Введите название категории");
      return;
    }

    try {
      setIsSubmitting(true);
      await api(`/category/update-category/${editingCategory.id}`, {
        method: "PUT",
        body: { name: categoryName },
      });
      toast.success("Категория обновлена");
      setShowEditCategory(false);
      setEditingCategory(null);
      setCategoryName("");
      loadData();
    } catch (error: any) {
      console.error("Ошибка обновления категории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось обновить категорию";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (
      !window.confirm(`Вы уверены, что хотите удалить категорию "${name}"?`)
    ) {
      return;
    }

    try {
      await api(`/category/delete-category/${id}`, {
        method: "DELETE",
      });
      toast.success("Категория удалена");
      loadData();
    } catch (error: any) {
      console.error("Ошибка удаления категории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось удалить категорию";
      toast.error(errorMessage);
    }
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowEditCategory(true);
  };

  // Подкатегории CRUD
  const handleCreateSubcategory = async () => {
    if (!subcategoryName.trim() || !selectedCategoryId) {
      toast.error("Введите название подкатегории и выберите категорию");
      return;
    }

    try {
      setIsSubmitting(true);
      await api("/subcategory/create-subcategory", {
        method: "POST",
        body: { name: subcategoryName, categoryId: selectedCategoryId },
      });
      toast.success("Подкатегория создана");
      setShowAddSubcategory(false);
      setSubcategoryName("");
      setSelectedCategoryId(null);
      loadData();
    } catch (error: any) {
      console.error("Ошибка создания подкатегории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось создать подкатегорию";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategory || !subcategoryName.trim() || !selectedCategoryId) {
      toast.error("Введите название подкатегории и выберите категорию");
      return;
    }

    try {
      setIsSubmitting(true);
      await api(`/subcategory/update-subcategory/${editingSubcategory.id}`, {
        method: "PATCH",
        body: { name: subcategoryName, categoryId: selectedCategoryId },
      });
      toast.success("Подкатегория обновлена");
      setShowEditSubcategory(false);
      setEditingSubcategory(null);
      setSubcategoryName("");
      setSelectedCategoryId(null);
      loadData();
    } catch (error: any) {
      console.error("Ошибка обновления подкатегории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось обновить подкатегорию";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubcategory = async (id: number, name: string) => {
    if (
      !window.confirm(`Вы уверены, что хотите удалить подкатегорию "${name}"?`)
    ) {
      return;
    }

    try {
      await api(`/subcategory/delete-subcategory/${id}`, {
        method: "DELETE",
      });
      toast.success("Подкатегория удалена");
      loadData();
    } catch (error: any) {
      console.error("Ошибка удаления подкатегории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось удалить подкатегорию";
      toast.error(errorMessage);
    }
  };

  const openEditSubcategoryModal = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setSelectedCategoryId(subcategory.categoryId);
    setShowEditSubcategory(true);
  };

  const openAddSubcategoryModal = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setShowAddSubcategory(true);
  };

  // Типы подкатегорий CRUD
  const handleCreateSubcategoryType = async () => {
    if (!subcategoryTypeName.trim() || !selectedSubcategoryId) {
      toast.error("Введите название типа подкатегории и выберите подкатегорию");
      return;
    }

    try {
      setIsSubmitting(true);
      await api("/subcategory-type/create", {
        method: "POST",
        body: {
          name: subcategoryTypeName,
          subcategoryId: selectedSubcategoryId,
        },
      });
      toast.success("Тип подкатегории создан");
      setShowAddSubcategoryType(false);
      setSubcategoryTypeName("");
      setSelectedSubcategoryId(null);
      loadData();
    } catch (error: any) {
      console.error("Ошибка создания типа подкатегории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось создать тип подкатегории";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubcategoryType = async () => {
    if (
      !editingSubcategoryType ||
      !subcategoryTypeName.trim() ||
      !selectedSubcategoryId
    ) {
      toast.error("Введите название типа подкатегории и выберите подкатегорию");
      return;
    }

    try {
      setIsSubmitting(true);
      await api(`/subcategory-type/${editingSubcategoryType.id}`, {
        method: "PATCH",
        body: {
          name: subcategoryTypeName,
          subcategoryId: selectedSubcategoryId,
        },
      });
      toast.success("Тип подкатегории обновлен");
      setShowEditSubcategoryType(false);
      setEditingSubcategoryType(null);
      setSubcategoryTypeName("");
      setSelectedSubcategoryId(null);
      loadData();
    } catch (error: any) {
      console.error("Ошибка обновления типа подкатегории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось обновить тип подкатегории";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubcategoryType = async (id: number, name: string) => {
    if (
      !window.confirm(
        `Вы уверены, что хотите удалить тип подкатегории "${name}"?`,
      )
    ) {
      return;
    }

    try {
      await api(`/subcategory-type/${id}`, {
        method: "DELETE",
      });
      toast.success("Тип подкатегории удален");
      loadData();
    } catch (error: any) {
      console.error("Ошибка удаления типа подкатегории:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось удалить тип подкатегории";
      toast.error(errorMessage);
    }
  };

  const openEditSubcategoryTypeModal = (subcategoryType: SubcategoryType) => {
    setEditingSubcategoryType(subcategoryType);
    setSubcategoryTypeName(subcategoryType.name);
    setSelectedSubcategoryId(subcategoryType.subcategoryId);
    setShowEditSubcategoryType(true);
  };

  const openAddSubcategoryTypeModal = (subcategoryId: number) => {
    setSelectedSubcategoryId(subcategoryId);
    setShowAddSubcategoryType(true);
  };

  // Характеристики типов CRUD
  const handleCreateTypeField = async () => {
    if (!typeFieldName.trim() || !selectedTypeId) {
      toast.error("Введите название характеристики и выберите тип");
      return;
    }

    try {
      setIsSubmitting(true);
      await api("/type-field/create", {
        method: "POST",
        body: { name: typeFieldName, typeId: selectedTypeId },
      });
      toast.success("Характеристика создана");
      setShowAddTypeField(false);
      setTypeFieldName("");
      setSelectedTypeId(null);
      loadData();
    } catch (error: any) {
      console.error("Ошибка создания характеристики:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось создать характеристику";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTypeField = async () => {
    if (!editingTypeField || !typeFieldName.trim() || !selectedTypeId) {
      toast.error("Введите название характеристики и выберите тип");
      return;
    }

    try {
      setIsSubmitting(true);
      await api(`/type-field/${editingTypeField.id}`, {
        method: "PATCH",
        body: { name: typeFieldName, typeId: selectedTypeId },
      });
      toast.success("Характеристика обновлена");
      setShowEditTypeField(false);
      setEditingTypeField(null);
      setTypeFieldName("");
      setSelectedTypeId(null);
      loadData();
    } catch (error: any) {
      console.error("Ошибка обновления характеристики:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось обновить характеристику";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTypeField = async (id: number, name: string) => {
    if (
      !window.confirm(
        `Вы уверены, что хотите удалить характеристику "${name}"?`,
      )
    ) {
      return;
    }

    try {
      await api(`/type-field/${id}`, {
        method: "DELETE",
      });
      toast.success("Характеристика удалена");
      loadData();
    } catch (error: any) {
      console.error("Ошибка удаления характеристики:", error);
      const errorMessage =
        error.response?.data?.message || "Не удалось удалить характеристику";
      toast.error(errorMessage);
    }
  };

  const openEditTypeFieldModal = (typeField: TypeField) => {
    setEditingTypeField(typeField);
    setTypeFieldName(typeField.name);
    setSelectedTypeId(typeField.typeId);
    setShowEditTypeField(true);
  };

  const openAddTypeFieldModal = (typeId: number) => {
    setSelectedTypeId(typeId);
    setShowAddTypeField(true);
  };

  const closeModals = () => {
    setShowAddCategory(false);
    setShowEditCategory(false);
    setEditingCategory(null);
    setCategoryName("");
    setShowAddSubcategory(false);
    setShowEditSubcategory(false);
    setEditingSubcategory(null);
    setSubcategoryName("");
    setSelectedCategoryId(null);
    setShowAddSubcategoryType(false);
    setShowEditSubcategoryType(false);
    setEditingSubcategoryType(null);
    setSubcategoryTypeName("");
    setSelectedSubcategoryId(null);
    setShowAddTypeField(false);
    setShowEditTypeField(false);
    setEditingTypeField(null);
    setTypeFieldName("");
    setSelectedTypeId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Typography className="text-3xl font-bold">
            Управление категориями
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Создание и редактирование категорий и подкатегорий товаров
          </Typography>
        </div>
        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">
          Управление категориями
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Создание и редактирование категорий и подкатегорий товаров
        </Typography>
      </div>

      <div className="grid gap-6">
        {/* Категории и подкатегории */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Категории и подкатегории</h3>
            <Button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
              onClick={() => setShowAddCategory(true)}
            >
              <Plus className="h-4 w-4" />
              Добавить категорию
            </Button>
          </div>

          <div className="space-y-1">
            {categories.length === 0 ? (
              <p className="py-8 text-center text-gray-500">Нет категорий</p>
            ) : (
              categories.map((category) => {
                const categorySubcategories = subcategories.filter(
                  (sub) => sub.categoryId === category.id,
                );
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id}>
                    {/* Категория */}
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded p-1 hover:bg-gray-200"
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500">
                          ({categorySubcategories.length})
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="rounded p-2 text-green-600 transition-colors hover:bg-green-50"
                          title="Добавить подкатегорию"
                          type="button"
                          onClick={() => openAddSubcategoryModal(category.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Редактировать"
                          type="button"
                          onClick={() => openEditCategoryModal(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
                          title="Удалить"
                          type="button"
                          onClick={() =>
                            handleDeleteCategory(category.id, category.name)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Подкатегории */}
                    {isExpanded && categorySubcategories.length > 0 && (
                      <div className="mt-1 ml-8 space-y-1">
                        {categorySubcategories.map((subcategory) => {
                          const subcategorySubcategoryTypes =
                            subcategoryTypes.filter(
                              (type) => type.subcategoryId === subcategory.id,
                            );
                          const isSubcategoryExpanded =
                            expandedSubcategories.has(subcategory.id);

                          return (
                            <div key={subcategory.id}>
                              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                                <div className="flex items-center gap-2">
                                  <button
                                    className="rounded p-1 hover:bg-gray-200"
                                    type="button"
                                    onClick={() =>
                                      toggleSubcategory(subcategory.id)
                                    }
                                  >
                                    {isSubcategoryExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </button>
                                  <span className="text-sm font-medium">
                                    {subcategory.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({subcategorySubcategoryTypes.length})
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-50"
                                    title="Добавить тип подкатегории"
                                    type="button"
                                    onClick={() =>
                                      openAddSubcategoryTypeModal(
                                        subcategory.id,
                                      )
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="rounded p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                                    title="Редактировать"
                                    type="button"
                                    onClick={() =>
                                      openEditSubcategoryModal(subcategory)
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50"
                                    title="Удалить"
                                    type="button"
                                    onClick={() =>
                                      handleDeleteSubcategory(
                                        subcategory.id,
                                        subcategory.name,
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Типы подкатегорий */}
                              {isSubcategoryExpanded &&
                                subcategorySubcategoryTypes.length > 0 && (
                                  <div className="mt-1 ml-6 space-y-1">
                                    {subcategorySubcategoryTypes.map(
                                      (subcategoryType) => {
                                        const typeTypeFields =
                                          typeFields.filter(
                                            (field) =>
                                              field.typeId ===
                                              subcategoryType.id,
                                          );
                                        const isTypeExpanded =
                                          expandedTypes.has(subcategoryType.id);

                                        return (
                                          <div key={subcategoryType.id}>
                                            <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-2.5 transition-colors hover:bg-gray-50">
                                              <div className="flex items-center gap-2">
                                                <button
                                                  className="rounded p-1 hover:bg-gray-200"
                                                  type="button"
                                                  onClick={() =>
                                                    toggleType(
                                                      subcategoryType.id,
                                                    )
                                                  }
                                                >
                                                  {isTypeExpanded ? (
                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                  ) : (
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                  )}
                                                </button>
                                                <span className="text-sm">
                                                  {subcategoryType.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                  ({typeTypeFields.length})
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <button
                                                  className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-50"
                                                  title="Добавить характеристику"
                                                  type="button"
                                                  onClick={() =>
                                                    openAddTypeFieldModal(
                                                      subcategoryType.id,
                                                    )
                                                  }
                                                >
                                                  <Plus className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                  className="rounded p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                                                  title="Редактировать"
                                                  type="button"
                                                  onClick={() =>
                                                    openEditSubcategoryTypeModal(
                                                      subcategoryType,
                                                    )
                                                  }
                                                >
                                                  <Edit className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                  className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50"
                                                  title="Удалить"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteSubcategoryType(
                                                      subcategoryType.id,
                                                      subcategoryType.name,
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Характеристики типов */}
                                            {isTypeExpanded &&
                                              typeTypeFields.length > 0 && (
                                                <div className="mt-1 ml-5 space-y-1">
                                                  {typeTypeFields.map(
                                                    (typeField) => (
                                                      <div
                                                        key={typeField.id}
                                                        className="flex items-center justify-between rounded-lg border border-gray-400 bg-gray-50 p-2 transition-colors hover:bg-gray-100"
                                                      >
                                                        <span className="text-sm text-gray-700">
                                                          {typeField.name}
                                                        </span>
                                                        <div className="flex gap-1.5">
                                                          <button
                                                            className="rounded p-1 text-blue-600 transition-colors hover:bg-blue-50"
                                                            title="Редактировать"
                                                            type="button"
                                                            onClick={() =>
                                                              openEditTypeFieldModal(
                                                                typeField,
                                                              )
                                                            }
                                                          >
                                                            <Edit className="h-3 w-3" />
                                                          </button>
                                                          <button
                                                            className="rounded p-1 text-red-600 transition-colors hover:bg-red-50"
                                                            title="Удалить"
                                                            type="button"
                                                            onClick={() =>
                                                              handleDeleteTypeField(
                                                                typeField.id,
                                                                typeField.name,
                                                              )
                                                            }
                                                          >
                                                            <Trash2 className="h-3 w-3" />
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно создания категории */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Создать категорию</h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              className="mb-4"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Название категории"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleCreateCategory}
              >
                {isSubmitting ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования категории */}
      {showEditCategory && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Редактировать категорию</h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              className="mb-4"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Название категории"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleUpdateCategory}
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания подкатегории */}
      {showAddSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Создать подкатегорию</h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              className="mb-4"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="Название подкатегории"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleCreateSubcategory}
              >
                {isSubmitting ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования подкатегории */}
      {showEditSubcategory && editingSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Редактировать подкатегорию
              </h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Категория
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2"
                value={selectedCategoryId || ""}
                onChange={(e) =>
                  setSelectedCategoryId(Number(e.target.value) || null)
                }
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              className="mb-4"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="Название подкатегории"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleUpdateSubcategory}
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания типа подкатегории */}
      {showAddSubcategoryType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Создать тип подкатегории
              </h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              className="mb-4"
              value={subcategoryTypeName}
              onChange={(e) => setSubcategoryTypeName(e.target.value)}
              placeholder="Название типа подкатегории"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleCreateSubcategoryType}
              >
                {isSubmitting ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования типа подкатегории */}
      {showEditSubcategoryType && editingSubcategoryType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Редактировать тип подкатегории
              </h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Подкатегория
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2"
                value={selectedSubcategoryId || ""}
                onChange={(e) =>
                  setSelectedSubcategoryId(Number(e.target.value) || null)
                }
              >
                <option value="">Выберите подкатегорию</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              className="mb-4"
              value={subcategoryTypeName}
              onChange={(e) => setSubcategoryTypeName(e.target.value)}
              placeholder="Название типа подкатегории"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleUpdateSubcategoryType}
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания характеристики */}
      {showAddTypeField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Создать характеристику</h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              className="mb-4"
              value={typeFieldName}
              onChange={(e) => setTypeFieldName(e.target.value)}
              placeholder="Название характеристики"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleCreateTypeField}
              >
                {isSubmitting ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования характеристики */}
      {showEditTypeField && editingTypeField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Редактировать характеристику
              </h3>
              <button
                className="rounded p-1 hover:bg-gray-100"
                type="button"
                onClick={closeModals}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Тип подкатегории
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2"
                value={selectedTypeId || ""}
                onChange={(e) =>
                  setSelectedTypeId(Number(e.target.value) || null)
                }
              >
                <option value="">Выберите тип</option>
                {subcategoryTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              className="mb-4"
              value={typeFieldName}
              onChange={(e) => setTypeFieldName(e.target.value)}
              placeholder="Название характеристики"
            />
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={closeModals}>
                Отмена
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
                onClick={handleUpdateTypeField}
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
