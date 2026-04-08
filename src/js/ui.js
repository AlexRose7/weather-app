function formatForecastTime(dateText) {
  return new Date(dateText).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function renderWeather(data) {
  const weatherResult = document.querySelector('#weather-result');
  const cityName = document.querySelector('#city-name');
  const date = document.querySelector('#current-date');
  const temperature = document.querySelector('#temperature');
  const description = document.querySelector('#description');
  const humidity = document.querySelector('#humidity');
  const windSpeed = document.querySelector('#wind-speed');
  const feelsLike = document.querySelector('#feels-like');
  const pressure = document.querySelector('#pressure');
  const icon = document.querySelector('#weather-icon');
  const errorMessage = document.querySelector('#error-message');

  // город
  cityName.textContent = data.name;

  // дата
  const now = new Date();
  date.textContent = now
    .toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .replace(/^./, (symbol) => symbol.toUpperCase());

  // температура
  temperature.textContent = `${Math.round(data.main.temp)}°C`;

  // описание
  description.textContent = data.weather[0].description;

  // детали
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} м/с`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  pressure.textContent = `${data.main.pressure} hPa`;

  // иконка
  const iconCode = data.weather[0].icon;
  icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  icon.alt = data.weather[0].description;

  // скрываем ошибку
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');

  // показываем результат
  weatherResult.classList.remove('hidden');
}

export function renderForecast(items) {
  const forecastList = document.querySelector('#forecast-list');

  if (!forecastList) return;

  if (!items.length) {
    forecastList.innerHTML = '';
    return;
  }

  const now = new Date();

  forecastList.innerHTML = items
    .map((item, index) => {
      const itemDate = new Date(item.dt * 1000);
      const isCurrent = index === 0;

      return `
        <article class="forecast-card glass-card ${isCurrent ? 'forecast-current' : ''}">
          <p class="forecast-time">${formatForecastTime(item.dt_txt)}</p>
          <img
            class="weather-icon"
            src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
            alt="${item.weather[0].description}"
          />
          <p class="forecast-temp">${Math.round(item.main.temp)}°C</p>
        </article>
      `;
    })
    .join('');
}

export function renderRecentSearches(cities, onClick, onDelete) {
  const container = document.querySelector('#recent-searches');

  if (!container) return;

  if (!cities.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = cities
    .map(
      (city) => `
        <div class="recent-chip">
          <button class="recent-item" data-city="${city}" type="button">${city}</button>
          <button class="recent-remove" data-city="${city}" type="button" aria-label="Удалить ${city}">×</button>
        </div>
      `
    )
    .join('');

  container.querySelectorAll('.recent-item').forEach((button) => {
    button.addEventListener('click', () => {
      onClick(button.dataset.city);
    });
  });

  container.querySelectorAll('.recent-remove').forEach((button) => {
    button.addEventListener('click', () => {
      onDelete(button.dataset.city);
    });
  });
}

export function showError(message) {
  const errorMessage = document.querySelector('#error-message');
  const weatherResult = document.querySelector('#weather-result');

  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');

  weatherResult.classList.add('hidden');
}

export function showLoading() {
  const loading = document.querySelector('#loading');
  loading.classList.remove('hidden');
}

export function hideLoading() {
  const loading = document.querySelector('#loading');
  loading.classList.add('hidden');
}