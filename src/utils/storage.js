const STORAGE_KEY = 'weather-dashboard'

const DEFAULTS = { city: 'Beirut', unit: 'C', recent: [] }

// localStorage can be unavailable (private mode, blocked cookies) or hold bad data,
// so every read falls back to the defaults instead of crashing the app.
export function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { ...DEFAULTS, ...saved }
  } catch {
    return DEFAULTS
  }
}

export function savePreferences(preferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Saving is a convenience; the app works the same without it.
  }
}
