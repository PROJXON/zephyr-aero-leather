import Link from "next/link"

export default function NavLink({ href, classes, label }) {
    return <Link href={href} className={classes}>{label}</Link>
}