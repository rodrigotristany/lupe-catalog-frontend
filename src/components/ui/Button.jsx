const variants = {
  primary: 'bg-lupe-light-pink text-lupe-blue font-bold hover:scale-105 active:scale-95 transition-transform duration-150',
  secondary: 'bg-lupe-light-blue hover:bg-[#b0c8e8] text-lupe-blue',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-lupe-light-blue text-lupe-blue',
  outline: 'border border-lupe-blue hover:bg-lupe-light-blue text-lupe-blue',
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
        transition-colors duration-150 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
