# Refactoring Plan

## Текущие проблемы

### API — два параллельных слоя

- `src/lib/api/instance.ts` — `ofetch`-инстанс, используется основным кодом
- `src/app/(feed)/(search)/_lib/utils/fetcher.ts` — кастомный `fetch`-wrapper, используется feature-слоями внутри роута

### UI — две параллельные дизайн-системы

- `src/components/ui/` — старая shared UI
- `src/app/(feed)/(search)/_lib/ui/` — новая UI внутри route-сегмента

### Дублирование компонентов

- `like-button`: `components/like-button/` + `_features/favorites/ui/like-button/`
- `product-card`: `components/product-card/` + `_features/feed/ui/product-feed/ProductCard/` + `_lib/ui/product-card/`
- `product-preview`: `components/product-card/product-preview/` + `_lib/ui/product-preview/`

### Нейминг

- Папки: в основном kebab-case (`product-card/`) но местами PascalCase (`ProductCard/`, `TrendCard/`)
- Нет единого соглашения — цель: **PascalCase** для всех компонентов и их папок

### Tooling

- `prettier` + `prettier-plugin-tailwindcss` + `oxfmt` — три инструмента форматирования одновременно
- Скрипт `format` использует prettier, `fmt` — oxfmt
- Цель: оставить только `oxfmt`

### Inline Tailwind в компонентах

- `app/profile/favorites/_components/favorites-feed.tsx`
- `app/(feed)/product/[productId]/_components/product-map.tsx`
- Цель: только CSS-модули, Tailwind только для глобальных токенов в `globals.css`

### Мусор

- `components/_deprecated/`
- `components/ui/_deprecated/`
- `app/(feed)/_temp/`
- `_features/category/api/temp/`

---

## Фазы

### Фаза 1 — Tooling [ ]

> Без риска, быстро

- [ x ] Удалить `prettier` и `prettier-plugin-tailwindcss` из `devDependencies`
- [ x ] Удалить `prettier.config.js`
- [ x ] Удалить скрипт `format` из `package.json`, оставить только `fmt`
- [ x ] Удалить папки с мусором:
  - `components/_deprecated/`
  - `components/ui/_deprecated/`
  - `app/(feed)/_temp/`
  - `_features/category/api/temp/`

---

### Фаза 2 — Унификация API [ ]

> Один инстанс, один способ делать запросы

- [ ] Оставить `src/lib/api/instance.ts` (`ofetch`) как единственный HTTP-клиент
- [ ] Перевести все `_features/*/api/*.ts` с кастомного `fetcher` на `api` из `instance.ts`
- [ ] Удалить `_lib/utils/fetcher.ts`
- [ ] Удалить `_lib/utils/isServer.ts` (дубль `src/lib/is-server.ts`)
- [ ] Удалить `_lib/utils/safe/`
- [ ] Перенести `_lib/utils/format/` в `src/lib/format.ts` (частично уже есть)
- [ ] Удалить `_lib/utils/` полностью

---

### Фаза 3 — Единая дизайн-система [ ]

> `src/components/ui/` — единственный источник правды

- [ ] Сравнить каждый компонент из `_lib/ui/` с аналогом в `components/ui/`, взять более полную версию
- [ ] Смержить в `components/ui/`: avatar, badge, breadcrumb, button, dialog, field, input, select, skeleton, spinner, sonner, typography, product-card, product-grid, product-preview, logo, link
- [ ] Обновить все импорты в `_features/` на `@/components/ui`
- [ ] Удалить `app/(feed)/(search)/_lib/ui/` полностью
- [ ] Разобрать дублирующиеся компоненты:
  - Оставить одну `like-button` в `components/` или поднять в `_features/favorites/`
  - Оставить одну `product-card` в `components/ui/`

---

### Фаза 4 — Устранение inline Tailwind [ ]

> Только CSS-модули в компонентах

- [ ] `favorites-feed.tsx` → выделить CSS-модуль `favorites-feed.module.css`
- [ ] `product-map.tsx` → выделить CSS-модуль `product-map.module.css`
- [ ] Прогнать поиск по `className="` на предмет Tailwind-классов в остальных файлах
- [ ] Tailwind оставить только в `globals.css` для токенов и утилит

---

### Фаза 5 — Нейминг PascalCase [ ]

> Делать после стабилизации структуры

Правило: компоненты и их папки — PascalCase, утилиты/хуки/api — camelCase, роуты и CSS-файлы — kebab-case.

- [ ] `components/ui/` — переименовать папки и файлы компонентов
- [ ] `components/auth-dialog/` → `components/AuthDialog/`
- [ ] `components/feed-wrapper/` → `components/FeedWrapper/`
- [ ] `components/like-button/` → (решается фазой 3)
- [ ] `components/product-card/` → (решается фазой 3)
- [ ] `app/_components/main-layout/` — переименовать внутренние файлы
- [ ] `_features/*/ui/` — привести к PascalCase
- [ ] Обновить все `index.ts`-барели после переименований
- [ ] Использовать VSCode Rename Symbol там где возможно

---

### Фаза 6 — Архитектура: выделяемость Admin [ ]

> Admin должен зависеть только от `src/lib/`, независимо от `(feed)`

- [ ] Провести импорт-аудит `app/admin/`: что тянется из feed-специфичного кода
- [ ] Всё общее между admin/profile/feed поднять в `src/lib/` или `src/components/`
- [ ] Убедиться что `app/admin/layout.tsx` не зависит от `app/_components/main-layout/`
- [ ] `app/admin/` — при необходимости добавить свой `_lib/` только для admin-специфичного
- [ ] Задокументировать границу: что считается shared, что admin-only

---

## Порядок выполнения

```
Фаза 1 (Tooling) → Фаза 2 (API) → Фаза 3 (UI) → Фаза 4 (CSS) → Фаза 5 (Нейминг) → Фаза 6 (Admin arch)
```

Нейминг — в последнюю очередь: механическая операция, безопаснее когда структура стабилизирована.
