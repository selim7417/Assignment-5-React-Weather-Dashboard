export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-panel status-panel--error" role="alert">
      <span className="status-icon" aria-hidden="true">⚠️</span>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
