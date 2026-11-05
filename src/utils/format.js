export function formatTemp(celsius, unit) {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius
  return `${Math.round(value)}°`
}

export function formatWind(kmh, unit) {
  return unit === 'F' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`
}

// Open-Meteo dates are plain "YYYY-MM-DD" strings in the city's local time zone.
// Appending T00:00 parses them as local dates instead of UTC midnight.
export function formatDay(isoDate) {
  const date = new Date(`${isoDate}T00:00`)
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    monthDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }
}
