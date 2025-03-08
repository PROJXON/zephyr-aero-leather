import Link from "next/link";

const NavLoggedOutBtn = ({ href, text }) => (<li>
    <Link href={href} className="nav-button-no-svg">
        {text}
    </Link>
</li>)

export default NavLoggedOutBtn