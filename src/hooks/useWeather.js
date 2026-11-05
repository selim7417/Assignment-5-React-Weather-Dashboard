import { useCallback, useEffect, useState } from 'react'
import { CityNotFoundError, fetchWeather } from '../api/openMeteo.js'

// Fetches weather for `city` whenever the city changes (or retry() is called).
// `onSuccess` runs after each successful fetch; pass a stable function (useCallback)
// because it is an effect dependency.
// Returns { status: 'loading' | 'error' | 'success', data, error, retry }.
export function useWeather(city, onSuccess) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ city: null, attempt: null, data: null, error: null })

  useEffect(() => {
    // Cancels the request if the city changes before the previous one finishes,
    // so a slow, older response can never overwrite a newer one.
    const controller = new AbortController()

    fetchWeather(city, controller.signal)
      .then((data) => {
        setResult({ city, attempt, data, error: null })
        onSuccess?.(data)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        const isNetworkError = err instanceof TypeError
        setResult({
          city,
          attempt,
          data: null,
          error: {
            message: isNetworkError
              ? 'Could not reach the weather service. Check your internet connection.'
              : err.message,
            canRetry: !(err instanceof CityNotFoundError),
          },
        })
      })

    return () => controller.abort()
  }, [city, attempt, onSuccess])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  // Derived during render: until the result for the current city/attempt arrives, we're loading.
  const isCurrent = result.city === city && result.attempt === attempt
  const status = !isCurrent ? 'loading' : result.error ? 'error' : 'success'

  return { status, data: result.data, error: result.error, retry }
}
