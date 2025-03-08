const NavButton = ({ onClick, className, srOnly, d, text }) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center p-2 hover:bg-gray-100 text-gray-900 duration-300 ${className}`}
    >
        {srOnly && <span className="sr-only">{srOnly}</span>}
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={d}
            />
        </svg>
        {text && <span className="hidden sm:flex">{text}</span>}
    </button>
)

export default NavButton