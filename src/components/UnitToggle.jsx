const UNITS = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
]

export default function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      {UNITS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={unit === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
