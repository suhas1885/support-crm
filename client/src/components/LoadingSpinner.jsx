export default function LoadingSpinner({ label = 'Loading tickets...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}
