# Weather Dashboard (React)

Assignment 5 for 020WBPES3 Web Programming: the Weather Dashboard rebuilt as a React application,
split into small, reusable function components with state managed by `useState` and data fetched
in `useEffect`.

Author: Selim Fata

## Features

- Search any city and see its current weather: temperature, condition, feels-like, humidity, wind,
  and today's high/low
- 5-day forecast with daily high/low and chance of rain
- °C / °F toggle (wind switches between km/h and mph too)
- Recent searches as clickable chips (only cities that were actually found are saved)
- Loading spinner, friendly error messages, and a "Try again" button for network errors
- Last city, unit and recent searches are remembered between visits (localStorage)
- Responsive layout for phone and desktop, with automatic light/dark theme

Weather data comes from [Open-Meteo](https://open-meteo.com/), which is free and needs **no API key**,
so the project runs as soon as dependencies are installed.

## Getting started

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

> Opening `index.html` directly (double-clicking it) shows a blank page: the browser can't run JSX
> on its own, so the app has to be served by Vite with `npm run dev`.

Other scripts:

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Lint the source with oxlint          |

## Project structure

```
src/
├── main.jsx                  Entry point
├── App.jsx                   Owns app state and decides what to render
├── index.css                 Global styles (CSS variables, responsive rules)
├── api/
│   └── openMeteo.js          Geocoding + forecast requests, shapes the API response
├── hooks/
│   └── useWeather.js         Custom hook: fetches weather in useEffect, returns status/data/error
├── components/
│   ├── SearchBar.jsx         Controlled input + submit button
│   ├── RecentSearches.jsx    Chips for recently found cities
│   ├── UnitToggle.jsx        °C / °F switch
│   ├── LoadingSpinner.jsx    Loading state
│   ├── ErrorMessage.jsx      Error state with optional "Try again"
│   ├── WeatherCard.jsx       Current conditions
│   ├── WeatherStat.jsx       One stat tile inside WeatherCard
│   ├── ForecastList.jsx      Forecast section
│   └── ForecastDay.jsx       One forecast day
└── utils/
    ├── format.js             Temperature, wind and date formatting
    ├── weatherCodes.js       WMO weather code → label + icon
    └── storage.js            Safe localStorage read/write
```

## Component tree

```
App
├── UnitToggle          (unit, onChange)
├── SearchBar           (onSearch, isLoading)
├── RecentSearches      (cities, activeCity, onSelect, onClear)
├── LoadingSpinner      (label)               ─┐
├── ErrorMessage        (message, onRetry)     │ only one of these renders,
├── WeatherCard         (location, current,    │ depending on the fetch status
│   │                    today, unit)          │
│   └── WeatherStat ×4  (label, value)         │
└── ForecastList        (days, unit)          ─┘
    └── ForecastDay ×5  (day, unit)
```

## State and data flow

| State            | Where it lives      | Why there                                                        |
| ---------------- | ------------------- | ---------------------------------------------------------------- |
| `query`          | `SearchBar`         | Only the input needs the text being typed                        |
| `city`           | `App`               | Drives the fetch and is set by both SearchBar and RecentSearches |
| `unit`           | `App`               | Read by WeatherCard and ForecastDay, set by UnitToggle           |
| `recent`         | `App`               | Updated after a successful fetch, read by RecentSearches         |
| `result`, `attempt` | `useWeather` hook | The fetched data/error, and a counter that lets "Try again" refetch |

- **Lifting state up:** `city` is lifted to `App` because two siblings change it (`SearchBar` and
  `RecentSearches`) and the fetch depends on it. Children receive callbacks (`onSearch`, `onSelect`)
  instead of setting state directly.
- **Data fetching:** `useWeather(city)` runs a `useEffect` with `[city, attempt, onSuccess]` as its
  dependency array, so it refetches only when the city changes or the user clicks "Try again". An
  `AbortController` cancels the old request if the user searches again before it finishes, so a
  slow response can't overwrite a newer one.
- **Loading/error/success:** the hook derives `status` during render (it is `loading` until the
  result for the current city arrives), and `App` renders exactly one of `LoadingSpinner`,
  `ErrorMessage`, or `WeatherCard` + `ForecastList`.
- **Prop depth:** no prop is passed more than two levels down. The deepest is `unit`
  (`App → ForecastList → ForecastDay`), which is exactly two levels, so Context wasn't needed.
- **Unit conversion** happens at display time (`utils/format.js`), so switching °C/°F is instant and
  doesn't trigger a new request.

## Tech stack

- React 19 (function components and hooks only)
- Vite 8
- Plain CSS with custom properties, Inter font (Google Fonts)
- Open-Meteo Geocoding and Forecast APIs
