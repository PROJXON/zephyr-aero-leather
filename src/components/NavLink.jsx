import Link from "next/link"

export default function NavLink({ href, classes, label, onClick }) {
    return <Link href={href} onClick={onClick || undefined} className={classes}>{label}</Link>
}