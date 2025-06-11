"use client"
import { useContext } from "react"
import { ChangeContext } from "./Checkout"

export default function ShippingFormInput({ name, placeholder, value, span, type = "text", options = [] }) {
    const onChange = useContext(ChangeContext)
    const classes = `w-full p-2 border rounded col-span-${span}`

    return (<>
        {type === "select" ? <select
            className={classes}
            name={name}
            value={value}
            onChange={onChange}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select> : <input
            className={classes}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />}
    </>)
}