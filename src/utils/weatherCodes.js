// WMO weather interpretation codes used by Open-Meteo.
// https://open-meteo.com/en/docs#weather_variable_documentation
const CONDITIONS = [
  { codes: [0], label: 'Clear sky', day: '☀️', night: '🌙' },
  { codes: [1], label: 'Mainly clear', day: '🌤️', night: '🌙' },
  { codes: [2], label: 'Partly cloudy', day: '⛅', night: '☁️' },
  { codes: [3], label: 'Overcast', day: '☁️', night: '☁️' },
  { codes: [45, 48], label: 'Fog', day: '🌫️', night: '🌫️' },
  { codes: [51, 53, 55, 56, 57], label: 'Drizzle', day: '🌦️', night: '🌧️' },
  { codes: [61, 63, 65, 66, 67], label: 'Rain', day: '🌧️', night: '🌧️' },
  { codes: [71, 73, 75, 77], label: 'Snow', day: '❄️', night: '❄️' },
  { codes: [80, 81, 82], label: 'Rain showers', day: '🌦️', night: '🌧️' },
  { codes: [85, 86], label: 'Snow showers', day: '🌨️', night: '🌨️' },
  { codes: [95], label: 'Thunderstorm', day: '⛈️', night: '⛈️' },
  { codes: [96, 99], label: 'Thunderstorm with hail', day: '⛈️', night: '⛈️' },
]

const UNKNOWN = { label: 'Unknown', day: '🌡️', night: '🌡️' }

export function describeWeather(code, isDay = true) {
  const condition = CONDITIONS.find((c) => c.codes.includes(code)) ?? UNKNOWN
  return { label: condition.label, icon: isDay ? condition.day : condition.night }
}
