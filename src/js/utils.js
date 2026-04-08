export function isValidCityName(city) {
  return typeof city === 'string' && city.trim().length > 0;
}

export function formatTemperature(temp) {
  return `${Math.round(temp)}°C`;
}