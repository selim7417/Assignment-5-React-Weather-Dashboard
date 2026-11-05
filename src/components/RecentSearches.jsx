export default function RecentSearches({ cities, activeCity, onSelect, onClear }) {
  if (cities.length === 0) return null

  return (
    <nav className="recent" aria-label="Recent searches">
      <span className="recent-label">Recent:</span>
      <ul className="recent-list">
        {cities.map((city) => (
          <li key={city}>
            <button
              type="button"
              className="chip"
              aria-current={city === activeCity ? 'true' : undefined}
              onClick={() => onSelect(city)}
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="link-button" onClick={onClear}>
        Clear
      </button>
    </nav>
  )
}
