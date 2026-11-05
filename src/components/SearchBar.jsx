import { useState } from 'react'

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()

  function handleSubmit(event) {
    event.preventDefault()
    if (!trimmed) return
    onSearch(trimmed)
    setQuery('')
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label htmlFor="city-search" className="visually-hidden">
        City name
      </label>
      <input
        id="city-search"
        type="search"
        placeholder="Search for a city…"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" disabled={!trimmed || isLoading}>
        Search
      </button>
    </form>
  )
}
