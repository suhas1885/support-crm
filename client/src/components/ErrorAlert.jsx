export default function ErrorAlert({ message, onRetry }) {
  return (
    <div
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      role="alert"
    >
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 text-red-300/90">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-100 transition hover:bg-red-500/30"
        >
          Try again
        </button>
      )}
    </div>
  )
}
