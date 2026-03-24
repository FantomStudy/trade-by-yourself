# Система фильтров и поиска товаров

## Обзор

Система поддерживает два подхода к фильтрации:

1. **ID-based** (старый) - использует числовые ID категорий
2. **Slug-based** (новый) - использует читаемые slug'и для URL

## Доступные API endpoints

### 1. Получение структуры каталога

#### GET /category/find-all

Получить список всех категорий

```typescript
const { data: categories } = useCategories();
// Response: Array<{ id: number; name: string; slug: string }>
```

#### GET /category/slug/:slug

Получить категорию с подкатегориями и типами

```typescript
const { data: category } = useCategoryBySlug("elektronika");
```

#### GET /category/path/:slugPath

Получить полный путь category → subcategory → type

```typescript
// Примеры:
// /category/path/elektronika
// /category/path/elektronika/telefony
// /category/path/elektronika/telefony/smartfony
```

### 2. Получение доступных фильтров

#### GET /product/available-filters

Получить список доступных значений для фильтров

```typescript
const { data: filters } = useAvailableFilters({
  categorySlug: "elektronika",
  subCategorySlug: "telefony",
  typeSlug: "smartfony",
});
```

Response:

```typescript
{
  fields: [
    {
      fieldId: 1,
      fieldName: "Объем памяти",
      isRequired: true,
      values: ["64GB", "128GB", "256GB"]
    }
  ],
  priceRange: { min: 15000, max: 150000 },
  states: ["NEW", "USED"],
  profileTypes: ["INDIVIDUAL", "OOO", "IP"],
  ratingRange: { min: 1, max: 5 }
}
```

### 3. Поиск товаров

#### GET /product/all-products

Поиск с фильтрами

```typescript
const { data: products } = useQuery({
  queryKey: ["products", filters],
  queryFn: () => getFeed({ query: filters }),
});
```

## Параметры фильтрации

```typescript
interface FeedFilters {
  categoryId?: number;
  // Категории (slug или ID)
  categorySlug?: string;
  // Динамические характеристики
  fieldValues?: Record<string, string>; // {"1": "128GB", "2": "Черный"}
  limit?: number;
  maxPrice?: number;
  maxRating?: number; // 1-5

  // Цена
  minPrice?: number;
  // Рейтинг продавца (фильтр по отзывам)
  minRating?: number; // 1-5

  // Пагинация
  page?: number;

  // Тип продавца
  profileType?: "INDIVIDUAL" | "IP" | "OOO";

  // Регион
  region?: string;

  // Поиск
  search?: string;
  // Сортировка
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance";

  // Состояние товара
  state?: "NEW" | "USED";

  subCategoryId?: number;

  subCategorySlug?: string;

  typeId?: number;
  typeSlug?: string;
}
```

## Использование компонента Filters

```tsx
import { Filters } from "@/app/(feed)/(search)/_components/filters";

<Filters
  typeSlug="smartfony"
  categorySlug="elektronika"
  subCategorySlug="telefony"
>
  {/* Контент страницы */}
</Filters>;
```

Компонент автоматически:

- Загружает доступные фильтры через `useAvailableFilters`
- Отображает только те опции, которые есть в товарах
- Синхронизирует фильтры с URL параметрами
- Поддерживает фильтрацию по рейтингу продавца (отзывы)

## Фильтр по отзывам/рейтингу

Система поддерживает фильтрацию товаров по рейтингу продавца:

```tsx
// В URL добавляются параметры:
// ?minRating=4&maxRating=5

// Компонент Filters отображает диапазон рейтинга:
<div className={styles.filterGroup}>
  <Typography className={styles.filterLabel}>Рейтинг продавца</Typography>
  <div className={styles.priceInputs}>
    <Input
      max={5}
      min={1}
      step={0.1}
      type="number"
      value={filters.minRating}
      placeholder="От 1"
    />
    <Input
      max={5}
      min={1}
      step={0.1}
      type="number"
      value={filters.maxRating}
      placeholder="До 5"
    />
  </div>
</div>
```

## Пример полного workflow

```tsx
// 1. Загрузить категории
const { data: categories } = useCategories();

// 2. При выборе категории загрузить доступные фильтры
const { data: availableFilters } = useAvailableFilters({
  categorySlug: selectedCategory,
  subCategorySlug: selectedSubCategory,
  typeSlug: selectedType,
});

// 3. Построить UI фильтров на основе availableFilters
// - Слайдер цены: priceRange.min - priceRange.max
// - Селект состояния: states []
// - Селекты характеристик: fields[].values []
// - Селект типа продавца: profileTypes []
// - Слайдер рейтинга: ratingRange.min - ratingRange.max

// 4. При изменении фильтров обновить URL и перезагрузить товары
const { data: products } = useQuery({
  queryKey: ["products", filters],
  queryFn: () => getFeed({ query: filters }),
});
```

## React Query хуки

```typescript
// Категории
import {
  useAvailableFilters,
  useCategories,
  useCategoryBySlug,
} from "@/api/hooks";

// Получить все категории
const { data: categories } = useCategories();

// Получить категорию с подкатегориями
const { data: category } = useCategoryBySlug("elektronika");

// Получить доступные фильтры
const { data: filters } = useAvailableFilters({
  categorySlug: "elektronika",
  subCategorySlug: "telefony",
});
```

## Миграция со старой системы

Старая система использовала ID:

```typescript
// Старое
{ categoryId: 1, subCategoryId: 5 }

// Новое (рекомендуется)
{ categorySlug: "elektronika", subCategorySlug: "telefony" }
```

Оба варианта поддерживаются, но slug'и предпочтительнее для SEO и читаемости URL.
