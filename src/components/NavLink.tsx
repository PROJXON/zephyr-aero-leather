import Link from "next/link";
import { NavLinkProps } from "../../types/types";

export default function NavLink({ href, classes, label, onClick }: NavLinkProps) {
    return (
        <Link href={href} onClick={onClick} className={classes}>
            {label}
        </Link>
    );
}
