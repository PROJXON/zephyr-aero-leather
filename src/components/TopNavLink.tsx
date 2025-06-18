import NavLink from "./NavLink";
import type { TopNavLinkProps } from "../../types/types";

export default function TopNavLink({ href, label, dropdownItems }: TopNavLinkProps) {
    return (
        <li className="relative group">
            <NavLink href={href} classes="text-lg font-medium text-black" label={label} />
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>

            {dropdownItems && (
                <div className="absolute left-0 w-48 bg-white shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <ul className="py-2">
                        {dropdownItems.map(item => (
                            <li key={item.slug}>
                                <NavLink
                                    href={`${href}/${item.slug}`}
                                    classes="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                                    label={item.name}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}
