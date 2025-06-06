import Link from "next/link"

export default function NavbarLink({ href, label, children }) {
    return (<li className="relative group">
        <Link
            href={href}
            className="text-lg font-medium text-black"
        >
            {label}
        </Link>
        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
        {children}
    </li>)
}