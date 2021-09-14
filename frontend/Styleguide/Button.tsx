export function Button({ children, className = "", ...otherProps }) {
  return (
    <button
      className={`cursor-pointer h-15 py-2.5 rounded font-medium flex-shrink bg-primary text-white ${className}`.trim()}
      {...otherProps}
    >
      {children}
    </button>
  );
}
