"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dialog,
  Field,
  Grid,
  Input,
  Logo,
  Select,
  Sheet,
  Textarea,
  Typography,
} from "@/components/ui";
import styles from "./page.module.css";

const categories = [
  { label: "Электроника", value: "electronics" },
  { label: "Одежда", value: "clothes" },
  { label: "Для дома", value: "home" },
  { label: "Спорт", value: "sport" },
];

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Typography variant="h3">{title}</Typography>
        <Typography className={styles.sectionDescription}>{description}</Typography>
      </div>
      {children}
    </section>
  );
};

const DevPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("electronics");
  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value ?? categories[0].value);
  };

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>UI-kit showcase</span>
          <Typography variant="h1">Все базовые компоненты в одном месте</Typography>
          <Typography className={styles.heroDescription}>
            Страница для быстрой проверки состояний, визуальных регрессий и общего качества UI без
            переключения между экранами.
          </Typography>
        </div>

        <div className={styles.heroAside}>
          <Logo />
          <div className={styles.heroActions}>
            <Button onClick={() => toast.success("Тостер работает как ожидается")}>
              Показать toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Можно быстро проверять системные уведомления")}
            >
              Второй сценарий
            </Button>
          </div>
        </div>
      </section>

      <Section
        title="Типографика"
        description="Все текстовые варианты, чтобы быстро сверять иерархию заголовков и обычного контента."
      >
        <div className={styles.typographyStack}>
          <Typography variant="h1">Заголовок H1</Typography>
          <Typography variant="h2">Заголовок H2</Typography>
          <Typography variant="h3">Заголовок H3</Typography>
          <Typography variant="h4">Заголовок H4</Typography>
          <Typography variant="h5">Заголовок H5</Typography>
          <Typography variant="h6">Заголовок H6</Typography>
          <Typography variant="p">
            Обычный текст параграфа для проверки ритма, цвета и читаемости на длинной строке.
          </Typography>
          <Typography variant="span">Строчный текст span</Typography>
        </div>
      </Section>

      <Section
        title="Кнопки"
        description="Основные варианты и размеры кнопок, включая иконоподобные compact-состояния."
      >
        <div className={styles.group}>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="danger">Danger</Button>
        </div>

        <div className={styles.group}>
          <Button size="sm">Small</Button>
          <Button size="md">Default</Button>
          <Button size="icon" aria-label="Избранное">
            ♥
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Закрыть">
            ×
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section
        title="Поля формы"
        description="Базовые input/textarea и пример поля с подписью, подсказкой ошибки и селектом."
      >
        <div className={styles.formLayout}>
          <Field>
            <Field.Label htmlFor="dev-title">Название объявления</Field.Label>
            <Input id="dev-title" placeholder="Например, велосипед Trek" defaultValue="iPhone 15" />
          </Field>

          <Field>
            <Field.Label htmlFor="dev-category">Категория</Field.Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <Select.Trigger id="dev-category" aria-label="Категория">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {categories.map((category) => (
                  <Select.Item key={category.value} value={category.value}>
                    {category.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Field>

          <Field>
            <Field.Label htmlFor="dev-price">Цена</Field.Label>
            <Input id="dev-price" inputMode="numeric" placeholder="15 000 ₽" />
            <Field.Error errors={[{ message: "Укажите цену в формате числа" }]} />
          </Field>

          <Field>
            <Field.Label htmlFor="dev-description">Описание</Field.Label>
            <Textarea
              id="dev-description"
              rows={5}
              defaultValue="Аккуратная демо-форма для проверки размеров, отступов и состояний."
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Навигация и брендинг"
        description="Logo, breadcrumb и аватары в разных состояниях для проверки навигационных паттернов."
      >
        <div className={styles.brandingGrid}>
          <div className={styles.card}>
            <Typography variant="h5">Logo</Typography>
            <div className={styles.logoRow}>
              <Logo />
              <Logo hiddenText />
            </div>
          </div>

          <div className={styles.card}>
            <Typography variant="h5">Breadcrumb</Typography>
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/">Главная</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/catalog">Каталог</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>UI-kit</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </div>

          <div className={styles.card}>
            <Typography variant="h5">Avatar</Typography>
            <div className={styles.group}>
              <Avatar src={null} fallback="ТС" size="sm" />
              <Avatar src="/logo.png" fallback="ТС" size="sm" />
              <Avatar src={null} fallback="ТС" size="lg" />
              <Avatar src="/logo.png" fallback="ТС" size="lg" />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Grid"
        description="Пример сетки для быстрых проверок карточной раскладки и адаптивных колонок."
      >
        <Grid className={styles.demoGrid}>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className={styles.gridCard}>
              <Typography variant="h5">Карточка {index + 1}</Typography>
              <Typography>
                Компонент `Grid` можно использовать как основу для ленты, подборок и наборов плиток.
              </Typography>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        title="Оверлеи"
        description="Dialog и Sheet в рабочем состоянии, чтобы быстро проверять модальные сценарии."
      >
        <div className={styles.group}>
          <Dialog>
            <Dialog.Trigger render={<Button>Открыть Dialog</Button>} />
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Подтверждение действия</Dialog.Title>
                <Dialog.Description>
                  Модальное окно показывает заголовок, описание и футер с действиями.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer showCloseButton>
                <Button onClick={() => toast.success("Действие подтверждено")}>Подтвердить</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>

          <Sheet>
            <Sheet.Trigger render={<Button variant="outline">Открыть Sheet</Button>} />
            <Sheet.Content side="right">
              <Sheet.Header>
                <Sheet.Title>Фильтры и действия</Sheet.Title>
                <Sheet.Description>
                  Боковая панель удобна для мобильных меню, фильтров и вторичных сценариев.
                </Sheet.Description>
              </Sheet.Header>
              <div className={styles.sheetBody}>
                <Button onClick={() => toast.info("Можно добавлять свои сценарии")}>
                  Тестовый action
                </Button>
                <Textarea rows={4} placeholder="Любой дополнительный контент внутри sheet" />
              </div>
            </Sheet.Content>
          </Sheet>
        </div>
      </Section>

      <Section
        title="Toast-сценарии"
        description="Набор кнопок для проверки всех основных статусов toaster-компонента."
      >
        <div className={styles.group}>
          <Button onClick={() => toast.success("Успешно сохранено")}>Success</Button>
          <Button variant="outline" onClick={() => toast.info("Нейтральное уведомление")}>
            Info
          </Button>
          <Button variant="ghost" onClick={() => toast.warning("Проверьте введённые данные")}>
            Warning
          </Button>
          <Button variant="danger" onClick={() => toast.error("Что-то пошло не так")}>
            Error
          </Button>
          <Button onClick={() => toast.loading("Загрузка...")}>Loading</Button>
        </div>
      </Section>
    </main>
  );
};

export default DevPage;
