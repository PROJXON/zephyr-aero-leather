const NavButton = ({ onClick, className = "", srOnly, d, text, fill = "currentColor" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center w-full justify-start gap-2 p-2 hover:bg-gray-100 text-gray-900 duration-300 rounded-lg font-medium ${className}`}
  >
    {srOnly && <span className="sr-only">{srOnly}</span>}
    {d && (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={fill}
      >
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={d}
        />
      </svg>
    )}
    {text && <span className="break-words">{text}</span>}
  </button>
)

export default NavButton;
