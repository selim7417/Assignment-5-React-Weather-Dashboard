import { useCallback, useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import RecentSearches from './components/RecentSearches.jsx'
import UnitToggle from './components/UnitToggle.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import WeatherCard from './components/WeatherCard.jsx'
import ForecastList from './components/ForecastList.jsx'
import { useWeather } from './hooks/useWeather.js'
import { loadPreferences, savePreferences } from './utils/storage.js'

const MAX_RECENT = 5
const saved = loadPreferences()

export default function App() {
  const [city, setCity] = useState(saved.city)
  const [unit, setUnit] = useState(saved.unit)
  const [recent, setRecent] = useState(saved.recent)

  // Only cities the API actually found go into the recent list,
  // using the API's spelling ("paris" -> "Paris").
  const addToRecent = useCallback(({ location }) => {
    const name = location.name
    setRecent((prev) => {
      const others = prev.filter((c) => c.toLowerCase() !== name.toLowerCase())
      return [name, ...others].slice(0, MAX_RECENT)
    })
  }, [])

  const { status, data, error, retry } = useWeather(city, addToRecent)

  // Remember the last city, unit and recent searches between visits.
  useEffect(() => {
    savePreferences({ city, unit, recent })
  }, [city, unit, recent])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Weather Dashboard</h1>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      <SearchBar onSearch={setCity} isLoading={status === 'loading'} />
      <RecentSearches
        cities={recent}
        activeCity={data?.location.name}
        onSelect={setCity}
        onClear={() => setRecent([])}
      />

      <main className="app-main">
        {status === 'loading' && <LoadingSpinner label={`Loading weather for ${city}…`} />}

        {status === 'error' && (
          <ErrorMessage message={error.message} onRetry={error.canRetry ? retry : undefined} />
        )}

        {status === 'success' && (
          <>
            <WeatherCard
              location={data.location}
              current={data.current}
              today={data.today}
              unit={unit}
            />
            <ForecastList days={data.forecast} unit={unit} />
          </>
        )}
      </main>

      <footer className="app-footer">
        Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
      </footer>
    </div>
  )
}
