"use client"
import { useContext } from "react"
import { ChangeContext } from "./Checkout"

export default function AddressFormInput({
    name,
    placeholder,
    value,
    span,
    error,
    type = "text",
    options = []
}) {
    const onChange = useContext(ChangeContext)
    const classes = `w-full p-2 border rounded col-span-${span}${error ? " border-red-400 placeholder-red-300" : ""}`
    const displayPlaceholder = error || placeholder

    return (<>
        {type === "select" ? <select
            className={classes}
            name={name}
            value={value}
            onChange={onChange}
        >
            <option value="">{displayPlaceholder}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select> : <input
            className={classes}
            type={type}
            name={name}
            placeholder={displayPlaceholder}
            value={error ? "" : value}
            onChange={onChange}
        />}
    </>)
}