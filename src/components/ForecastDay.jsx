import { describeWeather } from '../utils/weatherCodes.js'
import { formatDay, formatTemp } from '../utils/format.js'

export default function ForecastDay({ day, unit }) {
  const { label, icon } = describeWeather(day.code)
  const { weekday, monthDay } = formatDay(day.date)

  return (
    <li className="forecast-day">
      <p className="forecast-day__weekday">{weekday}</p>
      <p className="muted">{monthDay}</p>
      <span className="forecast-day__icon" role="img" aria-label={label} title={label}>
        {icon}
      </span>
      <p className="forecast-day__temps">
        <strong>{formatTemp(day.max, unit)}</strong>
        <span className="muted"> {formatTemp(day.min, unit)}</span>
      </p>
      <p className="forecast-day__rain" title="Chance of rain">
        💧 {day.rainChance ?? 0}%
      </p>
    </li>
  )
}
