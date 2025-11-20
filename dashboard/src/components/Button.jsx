export function Button({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 border-2 border-gray-700 text-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-colors font-medium ${className}`}
    >
      {children}
    </button>
  );
}
