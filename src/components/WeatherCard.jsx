import WeatherStat from './WeatherStat.jsx'
import { describeWeather } from '../utils/weatherCodes.js'
import { formatTemp, formatWind } from '../utils/format.js'

export default function WeatherCard({ location, current, today, unit }) {
  const { label, icon } = describeWeather(current.code, current.isDay)
  // Skip the region when it just repeats the city name ("Beirut, Beirut, Lebanon").
  const region = location.region !== location.name ? location.region : null
  const place = [region, location.country].filter(Boolean).join(', ')

  return (
    <section className="card weather-card" aria-labelledby="current-heading">
      <div className="weather-card__main">
        <div>
          <h2 id="current-heading" className="weather-card__city">{location.name}</h2>
          {place && <p className="muted">{place}</p>}
          <p className="weather-card__temp">{formatTemp(current.temperature, unit)}</p>
          <p className="weather-card__condition">{label}</p>
        </div>
        <span className="weather-card__icon" role="img" aria-label={label}>
          {icon}
        </span>
      </div>

      <dl className="weather-stats">
        <WeatherStat label="Feels like" value={formatTemp(current.feelsLike, unit)} />
        <WeatherStat label="Humidity" value={`${current.humidity}%`} />
        <WeatherStat label="Wind" value={formatWind(current.windSpeed, unit)} />
        <WeatherStat
          label="High / Low"
          value={`${formatTemp(today.max, unit)} / ${formatTemp(today.min, unit)}`}
        />
      </dl>
    </section>
  )
}
