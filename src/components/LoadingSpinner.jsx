export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="status-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}
