import Link from "next/link";

const NavLoggedOutBtn = ({ href, text }) => (
    <Link
      href={href}
      className="inline-flex items-center p-2 hover:bg-gray-100 text-gray-900 duration-300 rounded-lg font-medium"
    >
      {text}
    </Link>
);

export default NavLoggedOutBtn;
