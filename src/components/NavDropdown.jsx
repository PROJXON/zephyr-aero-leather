"use client";
import Link from "next/link";

const NavDropdown = ({ label, items, basePath, linkToBase = false }) => {
  return (
    <li className="relative group overflow-visible">
      <div className="relative inline-block">
        {linkToBase ? (
          <Link
            href={`/${basePath}`}
            className="text-lg font-medium text-black transition-all duration-300 relative"
          >
            {label}
            {/* Underline */}
            <span className="absolute left-1/2 -bottom-1 w-full h-[1.5px] bg-black transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center transform -translate-x-1/2" />
          </Link>
        ) : (
          <button
            className="text-lg font-medium text-black transition-all duration-300 relative"
            type="button"
          >
            {label}
            {/* Underline */}
            <span className="absolute left-1/2 -bottom-1 w-full h-[1.5px] bg-black transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center transform -translate-x-1/2" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <div className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${basePath}/${item.slug}`}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default NavDropdown;
