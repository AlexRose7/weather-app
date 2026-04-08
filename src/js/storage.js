const STORAGE_KEY = 'recent_searches';

export function saveRecentSearch(city) {
  const searches = getRecentSearches();

  const filtered = searches.filter((item) => item.toLowerCase() !== city.toLowerCase());

  filtered.unshift(city);

  const limited = filtered.slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
}

export function getRecentSearches() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function removeRecentSearch(city) {
  const searches = getRecentSearches();
  const filtered = searches.filter((item) => item.toLowerCase() !== city.toLowerCase());

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}