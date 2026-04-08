const API_KEY = import.meta.env.VITE_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    console.log('API error:', errorData);

    if (response.status === 401) {
      throw new Error('Неверный или неактивный API ключ');
    }

    if (response.status === 404) {
      throw new Error('Город не найден');
    }

    throw new Error(errorData.message || 'Не удалось получить данные о погоде');
  }

  return response.json();
}

export async function getWeatherByCity(city) {
  const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;

  return fetchJson(url);
}

export async function getForecastByCity(city) {
  const url = `${FORECAST_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
  const data = await fetchJson(url);

  const now = new Date();

  const startIndex = data.list.findIndex((item) => {
    const itemDate = new Date(item.dt * 1000);
    return itemDate >= now;
  });

  if (startIndex === -1) {
    return data.list.slice(0, 8);
  }

  return data.list.slice(startIndex, startIndex + 8);
}