export default function WeatherStat({ label, value }) {
  return (
    <div className="weather-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
