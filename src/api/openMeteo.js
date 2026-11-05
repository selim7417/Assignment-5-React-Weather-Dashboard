const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

// Thrown when the geocoding API has no match, so the UI can skip the "Try again" button.
export class CityNotFoundError extends Error {
  constructor(city) {
    super(`We couldn't find a city called "${city}". Check the spelling and try again.`)
    this.name = 'CityNotFoundError'
  }
}

async function getJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`The weather service responded with an error (${response.status}).`)
  }
  return response.json()
}

async function findCity(city, signal) {
  const params = new URLSearchParams({ name: city, count: '1', language: 'en', format: 'json' })
  const data = await getJson(`${GEOCODING_URL}?${params}`, signal)
  const place = data.results?.[0]
  if (!place) throw new CityNotFoundError(city)
  return place
}

// Looks up a city by name, then fetches its current weather and a 5-day forecast.
// All values come back in metric (°C, km/h); the UI converts them for display.
export async function fetchWeather(city, signal) {
  const place = await findCity(city, signal)

  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '6',
  })
  const { current, daily } = await getJson(`${FORECAST_URL}?${params}`, signal)

  const days = daily.time.map((date, i) => ({
    date,
    code: daily.weather_code[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    rainChance: daily.precipitation_probability_max[i],
  }))

  return {
    location: {
      name: place.name,
      region: place.admin1,
      country: place.country,
    },
    current: {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      code: current.weather_code,
      isDay: current.is_day === 1,
    },
    today: days[0],
    forecast: days.slice(1),
  }
}
