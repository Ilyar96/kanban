# Генератор компонентов

Этот проект использует Plop для автоматической генерации компонентов всех слоев архитектуры.

## Использование

```bash
npm run generate
```

Выберите нужный тип генератора и введите название.

## Доступные генераторы

### 1. Shared компоненты

**Опция:** `shared-component`
**Путь:** `src/shared/ui/Название/`
**Файлы:**

- `Название.tsx` - основной компонент
- `Название.module.scss` - стили компонента
- `Название.stories.tsx` - Storybook истории

### 2. Entities

**Опция:** `entity`
**Путь:** `src/entities/Название/`
**Структура:**

- `index.ts` - экспорт компонента
- `model/selectors/` - папка для селекторов (пустая)
- `model/services/` - папка для сервисов (пустая)
- `model/types/index.ts` - типы
- `model/slice/названиеSlice.ts` - Redux slice
- `ui/Название.tsx` - основной компонент
- `ui/Название.module.scss` - стили компонента
- `ui/Название.stories.tsx` - Storybook истории

### 3. Features

**Опция:** `feature`
**Путь:** `src/features/Название/`
**Структура:**

- `index.ts` - экспорт компонента
- `model/selectors/` - папка для селекторов (пустая)
- `model/services/` - папка для сервисов (пустая)
- `model/types/index.ts` - типы
- `model/slice/названиеSlice.ts` - Redux slice
- `ui/Название.tsx` - основной компонент
- `ui/Название.module.scss` - стили компонента
- `ui/Название.stories.tsx` - Storybook истории

### 4. Pages

**Опция:** `page`
**Путь:** `src/pages/Название/`
**Структура:**

- `index.ts` - экспорт компонента
- `model/selectors/` - папка для селекторов (пустая)
- `model/services/` - папка для сервисов (пустая)
- `model/types/index.ts` - типы
- `model/slice/названиеSlice.ts` - Redux slice
- `ui/Название.tsx` - основной компонент
- `ui/Название.module.scss` - стили компонента
- `ui/Название.stories.tsx` - Storybook истории

### 5. Widgets

**Опция:** `widget`
**Путь:** `src/widgets/Название/`
**Структура:**

- `index.ts` - экспорт компонента
- `ui/Название.tsx` - основной компонент
- `ui/Название.module.scss` - стили компонента
- `ui/Название.stories.tsx` - Storybook истории

## Примеры использования

### Создание Entity

```bash
npm run generate
# Выберите: entity
# Введите название: User
```

### Создание Feature

```bash
npm run generate
# Выберите: feature
# Введите название: AuthByUsername
```

### Создание Page

```bash
npm run generate
# Выберите: page
# Введите название: AboutPage
```

### Создание Widget

```bash
npm run generate
# Выберите: widget
# Введите название: Navbar
```

## Требования к названию

- Должно начинаться с заглавной буквы
- Может содержать только буквы и цифры
- Примеры: `Button`, `User`, `AuthByUsername`, `AboutPage`, `Navbar`
