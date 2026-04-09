# Weather Guesser
[![Maintainability](https://qlty.sh/gh/AlexRose7/projects/weather-app/maintainability.svg)](https://qlty.sh/gh/AlexRose7/projects/weather-app)

Weather Guesser — это веб-приложение для просмотра текущей погоды и краткосрочного прогноза по выбранному городу.
Пользователь может искать город, смотреть основные погодные показатели, открывать историю последних запросов и повторно выбирать города из списка.

## Функциональность

- поиск погоды по названию города
- отображение текущей температуры
- отображение описания погоды и иконки
- отображение влажности, ветра, давления и температуры «ощущается как»
- отображение краткосрочного прогноза
- история последних запросов
- удаление отдельных городов из истории
- обработка ошибок при некорректном вводе или несуществующем городе
- переключение между °C и °F

## Стек

### Frontend
- HTML
- CSS
- JavaScript
- Vite

### API
- OpenWeather API

### Client storage
- localStorage

## Запуск проекта локально

Установка зависимостей и запуск проекта:

```bash
npm install
npm run dev
```

Для работы приложения нужно создать файл `.env` в корне проекта и добавить API-ключ:

```env
VITE_API_KEY=your_api_key_here
```

## Деплой

https://weather-q6wp4bnrl-alexrose7s-projects.vercel.app/

## Выбранный проект из каталога

Ссылка на проект из каталога: [JavaScript/Build a Simple Weather App With Vanilla JavaScript](https://github.com/practical-tutorials/project-based-learning?tab=readme-ov-file#javascript)

## Автор
Aleksandre Vardosanidze

Проект выполнен в рамках учебной практики.