const variants = {
  primary: 'bg-lupe-500 hover:bg-lupe-600 text-white',
  secondary: 'bg-lupe-100 hover:bg-lupe-200 text-lupe-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-lupe-100 text-lupe-700',
  outline: 'border border-lupe-300 hover:bg-lupe-50 text-lupe-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-150 focus:outline-none focus:ring-2
        focus:ring-lupe-400 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
