# Atomic Refactoring Plan

## Текущее состояние

Работа накопила два слоя незакоммиченных изменений:

| Слой | Кол-во файлов | Описание |
|---|---|---|
| **Staged** (git index) | ~120 файлов | Переносы маршрутов, Header, Profile, UI, hooks, auth-contexts |
| **Unstaged** (рабочая копия) | ~80 файлов | Фиксы импортов в admin/profile/api, доработка компонентов |

Всё это одна нерасчленённая масса — если закоммитить как есть, история станет нечитаемой, а любой откат потребует ручного разбора.

---

## Стратегия разбивки

### Шаг 0 — Сохранить текущий прогресс

```bash
# Создать ветку-снапшот с полным текущим состоянием (staged + unstaged)
git stash push --include-untracked -m "wip: large refactor snapshot"

# Или создать WIP-ветку напрямую:
git checkout -b wip/large-refactor
git add -A
git commit -m "wip: snapshot before atomic split"
git checkout dev
```

> После этого любой атомарный коммит можно сверять с WIP-снапшотом через `git diff wip/large-refactor`.

---

## Атомарные группы (порядок важен — группы зависят друг от друга)

---

### Группа 1 — Flatten route groups `(feed)/(search)` → `(catalog)` + `product/` + `seller/`

**Почему первой:** Это чистые переименования файлов. После этого коммита маршруты меняются, но логика — нет. Все последующие группы уже работают с новой структурой путей.

**Файлы:**
```
src/app/(catalog)/                    ← было (feed)/(search)/(catalog)/
src/app/product/[productId]/          ← было (feed)/product/[productId]/
src/app/seller/[userId]/              ← было (feed)/seller/[sellerId]/

удалить: src/app/(feed)/(search)/_features/**
удалить: src/app/(feed)/(search)/_lib/**
удалить: src/app/(feed)/(search)/_components/**
```

**Проверка:** `next build` или `next dev` — страницы `/`, `/<slug>`, `/product/123`, `/seller/456` должны открываться.

**Коммит:**
```
refactor: flatten route groups - remove (feed)/(search) nesting
```

---

### Группа 2 — Migrate Header component

**Почему второй:** Header используется в `layout.tsx` — именно там и лежит самый прямой «потребитель». Нет зависимостей от группы 3+.

**Файлы:**
```
src/components/Header/
  Header.tsx
  Header.module.css
  HeaderActions.tsx
  MobileMenu/
  SearchCollapse/
  index.ts

удалить: src/app/_components/main-layout/header/**
удалить: src/app/_components/main-layout/index.ts
удалить: src/app/_components/index.ts

изменить: src/app/layout.tsx — импорт Header из @/components/Header
```

**Проверка:** Header рендерится на всех страницах.

**Коммит:**
```
refactor: move Header from app/_components to src/components/Header
```

---

### Группа 3 — Profile: sidebar → NavBar + my-products → products

**Почему третьей:** Изолированный scope — только profile layout и routes.

**Файлы:**
```
src/app/profile/_components/NavBar/     ← было sidebar/
  NavBar.tsx
  NavBar.module.css
  constants.ts
  index.ts

удалить: src/app/profile/_components/sidebar/**

src/app/profile/products/              ← было my-products/
  page.tsx
  [productId]/page.tsx
  _components/ProfileProducts/

изменить: src/app/profile/layout.tsx — импорт NavBar
изменить: src/app/profile/layout.module.css
```

**Проверка:** `/profile` открывается, навигация работает, `/profile/products` доступен.

**Коммит:**
```
refactor(profile): rename sidebar to NavBar, rename my-products to products
```

---

### Группа 4 — UI components: PascalCase + новые примитивы

**Почему четвёртой:** UI-примитивы — общая зависимость всего остального. Лучше стабилизировать их раньше потребителей.

**Файлы:**
```
src/components/ui/Avatar/       ← было avatar/ (реписан)
src/components/ui/Select/       ← новый
src/components/ui/Sheet/        ← было sheet/
src/components/ui/Typography/   ← было typography/

удалить: src/components/ui/avatar/
удалить: src/components/ui/sheet/
удалить: src/components/ui/typography/      (если не нужен kebab-alias)
удалить: src/components/ui/badge/           (мусор)

изменить: src/components/ui/index.ts — переэкспорт
```

**Проверка:** `tsc --noEmit` или `next build` — компоненты без ошибок типов.

**Коммит:**
```
refactor(ui): consolidate to PascalCase - Avatar, Select, Sheet, Typography
```

---

### Группа 5 — Hooks layer + remove AuthContext

**Почему пятой:** Хуки потребляют API. После стабилизации UI-примитивов можно зафиксировать хуки, не ломая компоненты.

**Файлы:**
```
src/hooks/
  useCategories.ts      ← новый
  useCurrentUser.ts     ← новый
  useProductFilters.ts  ← новый
  useUser.ts            ← новый
  useUserProducts.ts    ← новый
  useDeleteProduct.ts   ← новый (или перенести в компонент)
  utils/useQueryState.ts← новый

удалить: src/lib/contexts/auth/AuthContext.ts
удалить: src/lib/contexts/auth/AuthProvider.tsx
удалить: src/lib/contexts/auth/useAuth.ts
удалить: src/lib/contexts/auth/index.ts

изменить: src/lib/contexts/index.ts
изменить: src/app/providers.tsx
```

**Проверка:** Страницы, использующие auth-контекст, не падают.

**Коммит:**
```
refactor: add hooks layer, remove legacy AuthContext
```

---

### Группа 6 — API layer cleanup

**Почему шестой:** Апи-функции — самый нижний слой. Обновление здесь может потребовать ещё раз обновить импорты в потребителях — лучше делать здесь до потребителей.

**Файлы:**
```
src/api/banners/getBanners.ts
src/api/banners/index.ts
src/api/favorites/index.ts
src/api/products/getProduct.ts
src/api/products/getProducts.ts
src/api/requests/banner/index.ts
src/api/requests/reviews.ts
src/api/types/banner.ts

удалить: src/api/requests/banner/get-banners.ts   (дубль)
удалить: src/api/user/getUser.ts                  (переехало в users/)
удалить: src/api/user/index.ts

новые:
  src/api/reviews/
  src/api/users/
```

**Проверка:** `tsc --noEmit` без ошибок в api-слое.

**Коммит:**
```
refactor(api): unify banners/users/reviews API, remove legacy user/ dir
```

---

### Группа 7 — SellerCard + LikeButton + ProductCard consolidation

**Почему седьмой:** Продуктовые компоненты используются повсюду. Сначала стабилизируем их, потом фиксаем потребителей (admin, profile).

**Файлы:**
```
src/app/product/[productId]/_components/SellerCard/    ← новый
src/components/LikeButton/LikeButton.tsx               ← обновлён
src/components/LikeButton/useLike.ts                   ← вынесен
src/components/ProductCard/ProductCard.tsx             ← обновлён

удалить: src/components/like-button/            (старый kebab)
удалить: src/components/product-card/           (старый kebab)

изменить: src/components/product-feed-banner/  (удалить wide-banner, обновить экспорт)
```

**Проверка:** `ProductCard` и `LikeButton` рендерятся на каталоге без ошибок.

**Коммит:**
```
refactor: consolidate ProductCard, LikeButton, SellerCard components
```

---

### Группа 8 — Consumer updates: admin + profile + misc pages

**Почему последней:** Это фиксы импортов везде, где предыдущие 7 групп что-то переименовали. Только после стабилизации источников.

**Файлы:**
```
src/app/admin/_components/admin-sidebar.tsx
src/app/admin/advertising/...
src/app/admin/categories/...
src/app/admin/moderation/...
src/app/admin/promotion/...
src/app/admin/reviews/...
src/app/admin/support/...
src/app/admin/users/...

src/app/profile/analytics/page.tsx
src/app/profile/balance/page.tsx
src/app/profile/banner-request/page.tsx
src/app/profile/banner-stats/page.tsx
src/app/profile/create-product/page.tsx
src/app/profile/favorites/page.tsx
src/app/profile/messages/...
src/app/profile/promotion-request/...
src/app/profile/settings/...

src/app/globals.css
src/app/layout.tsx
src/app/not-found.tsx
src/lib/format.ts
src/types/banner.ts (новый)
src/types/category.ts
src/types/user.ts
```

**Проверка:** `next build` без ошибок. Все страницы в admin и profile открываются.

**Коммит:**
```
fix: update imports across admin, profile pages after refactor
```

---

## Порядок выполнения (дерево зависимостей)

```
1. Flatten routes
      ↓
2. Migrate Header
      ↓
3. Profile NavBar + products route
      ↓
4. UI PascalCase primitives
      ↓
5. Hooks + remove AuthContext
      ↓
6. API layer cleanup
      ↓
7. ProductCard / LikeButton / SellerCard
      ↓
8. Consumer import fixes (admin + profile)
```

---

## Практические команды

```bash
# Сохранить WIP-снапшот
git checkout -b wip/large-refactor
git add -A
git commit -m "wip: snapshot"
git checkout dev

# Для каждой группы — точечно добавлять файлы:
git add src/app/(catalog)/ src/app/product/ src/app/seller/
# ... убрать ненужные staged файлы:
git restore --staged src/components/Header/
# Проверить что добавлено:
git diff --cached --stat
# Закоммитить:
git commit -m "refactor: flatten route groups"
```

---

## Что НЕ делать

- ❌ Не коммитить «всё сразу» — если регрессия, откатить будет нечего
- ❌ Не смешивать логические изменения с рефакторингом путей в одном коммите
- ❌ Не удалять старые файлы до того, как새 потребители задеплоены
- ❌ Не трогать `globals.css` и `layout.tsx` раньше группы 8 — они зависят от Header и UI-примитивов

---

## Критерий готовности каждой группы

1. `npx tsc --noEmit` — нет ошибок типов
2. `next build` — успешная сборка
3. Страницы, связанные с группой, открываются в `next dev`
