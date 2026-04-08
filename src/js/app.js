import { getWeatherByCity, getForecastByCity } from './api.js';
import {
  renderWeather,
  renderForecast,
  renderRecentSearches,
  showError,
  showLoading,
  hideLoading,
} from './ui.js';
import {
  saveRecentSearch,
  getRecentSearches,
  removeRecentSearch,
} from './storage.js';
import { isValidCityName } from './utils.js';
import logo from '../assets/logo.svg';

let currentUnit = localStorage.getItem('unit') || 'C';
let lastWeatherData = null;
let lastForecastData = null;

export function initApp() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <main class="weather-app">
      <header class="app-header">
        <div class="header-left">
          <div class="app-logo">
            <img src="${logo}" alt="Weather Guesser logo" class="logo-image" />
          </div>
        </div>

        <div class="header-center">
          <div class="search-wrapper">
            <form class="search-form" id="search-form">
              <input
                class="search-input"
                id="city-input"
                type="text"
                placeholder="Введите город"
              />
              <button class="search-button" type="submit">Найти</button>
              <button class="unit-toggle" id="unit-toggle" type="button">°C</button>
            </form>
          </div>
        </div>

        <div class="header-right">
          <div class="history-panel">
            <button class="history-toggle hidden" id="history-toggle" type="button" hidden>
              Последние города
            </button>

            <div class="recent-dropdown hidden" id="recent-searches" hidden></div>
          </div>
        </div>
      </header>

      <p class="status status-loading hidden" id="loading">Загрузка...</p>
      <p class="status status-error hidden" id="error-message"></p>

      <section class="weather-layout hidden" id="weather-result">
        <section class="weather-main">
          <div class="weather-info">
            <h2 class="city-name" id="city-name">Город</h2>
            <p class="weather-date" id="current-date">Сегодня</p>

            <div class="temperature-row">
              <div class="weather-icon-wrap">
                <img id="weather-icon" class="weather-icon" alt="Иконка погоды" />
              </div>

              <div class="temperature-block">
                <p class="temperature-value" id="temperature">0°C</p>
                <p class="weather-description" id="description">Описание</p>
              </div>
            </div>
          </div>

          <aside class="weather-details glass-card">
            <div class="detail-item">
              <span class="detail-label">Влажность</span>
              <span class="detail-value" id="humidity">0%</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Ветер</span>
              <span class="detail-value" id="wind-speed">0 м/с</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Ощущается как</span>
              <span class="detail-value" id="feels-like">0°C</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Давление</span>
              <span class="detail-value" id="pressure">0 hPa</span>
            </div>
          </aside>
        </section>

        <section class="forecast-section">
          <h3 class="forecast-title">Ближайшие 24 часа</h3>

          <div class="forecast-list" id="forecast-list"></div>
        </section>
      </section>
    </main>
  `;

  const form = document.querySelector('#search-form');
  const input = document.querySelector('#city-input');
  const dropdown = document.querySelector('#recent-searches');
  const historyToggle = document.querySelector('#history-toggle');
  const unitToggle = document.querySelector('#unit-toggle');
  unitToggle.textContent = `°${currentUnit}`;

  historyToggle.addEventListener('click', () => {
    dropdown.hidden = !dropdown.hidden;
    dropdown.classList.toggle('hidden', dropdown.hidden);
    historyToggle.textContent = dropdown.hidden
      ? 'Последние города'
      : 'Скрыть историю';
  });

  unitToggle.addEventListener('click', () => {
    currentUnit = currentUnit === 'C' ? 'F' : 'C';
    unitToggle.textContent = `°${currentUnit}`;
    localStorage.setItem('unit', currentUnit);

    if (lastWeatherData) {
      renderWeather(lastWeatherData, currentUnit);
    }

    if (lastForecastData) {
      renderForecast(lastForecastData, currentUnit);
    }
  });

  function renderHistory() {
    const cities = getRecentSearches();

    if (!cities.length) {
      historyToggle.classList.add('hidden');
      historyToggle.hidden = true;
      dropdown.classList.add('hidden');
      dropdown.hidden = true;
      dropdown.innerHTML = '';
      historyToggle.textContent = 'Последние города';
      return;
    }

    historyToggle.classList.remove('hidden');
    historyToggle.hidden = false;
    historyToggle.textContent = dropdown.hidden
      ? 'Последние города'
      : 'Скрыть историю';

    renderRecentSearches(
      cities,
      (selectedCity) => {
        input.value = selectedCity;
        dropdown.classList.add('hidden');
        dropdown.hidden = true;
        historyToggle.textContent = 'Последние города';
        handleSearch(selectedCity);
      },
      (cityToDelete) => {
        removeRecentSearch(cityToDelete);
        renderHistory();
      }
    );
  }

  async function handleSearch(city) {
    if (!isValidCityName(city)) {
      showError('Введите название города');
      return;
    }
    input.value = city;

    showLoading();

    try {
      const weatherData = await getWeatherByCity(city);
      const forecastItems = await getForecastByCity(city);

      lastWeatherData = weatherData;
      lastForecastData = forecastItems;

      renderWeather(weatherData, currentUnit);
      renderForecast(forecastItems, currentUnit);
      saveRecentSearch(city);
      renderHistory();
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    dropdown.classList.add('hidden');
    dropdown.hidden = true;
    historyToggle.textContent = 'Последние города';
    handleSearch(input.value.trim());
  });

  renderHistory();
}