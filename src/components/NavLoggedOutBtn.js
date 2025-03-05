import Link from "next/link";

const NavLoggedOutBtn = ({ href, text }) => (<li>
    <Link href={href} className="block px-3 py-2 hover:bg-gray-100 rounded-md duration-300">
        {text}
    </Link>
</li>)

export default NavLoggedOutBtn