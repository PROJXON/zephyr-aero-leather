import type { NavButtonProps } from "../../types/types";
import type { ReactElement } from "react";

export default function NavButton({ onClick, className = "", srOnly, d, text, fill = "currentColor", badgeCount }: NavButtonProps): ReactElement {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center w-full justify-start gap-2 p-2 hover:bg-gray-100 text-gray-900 duration-300 rounded-lg text-lg font-medium ${className}`}
    >
      {srOnly && <span className="sr-only">{srOnly}</span>}
      {d && (
        <div className="relative">
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
          {badgeCount && badgeCount > 0 && (
            <span className="absolute -top-2 -right-1 text-neutral-dark text-xs font-medium">
              {badgeCount}
            </span>
          )}
        </div>
      )}
      {text && <span className="break-words">{text}</span>}
    </button>
  );
}
