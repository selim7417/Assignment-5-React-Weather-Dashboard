import ForecastDay from './ForecastDay.jsx'

export default function ForecastList({ days, unit }) {
  return (
    <section className="card" aria-labelledby="forecast-heading">
      <h2 id="forecast-heading" className="section-title">{days.length}-day forecast</h2>
      <ul className="forecast-list">
        {days.map((day) => (
          <ForecastDay key={day.date} day={day} unit={unit} />
        ))}
      </ul>
    </section>
  )
}
