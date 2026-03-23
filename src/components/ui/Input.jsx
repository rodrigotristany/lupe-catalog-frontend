export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`
          w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        rows={4}
        className={`
          w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent
          resize-y disabled:bg-gray-50
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`
          w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
