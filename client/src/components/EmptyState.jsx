export default function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
        📭
      </div>
      <h3 className="text-lg font-medium text-slate-200">
        {hasFilters ? 'No matching tickets' : 'No tickets yet'}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        {hasFilters
          ? 'Try a different search term or status filter.'
          : 'Use the form above to create your first support ticket.'}
      </p>
    </div>
  )
}
