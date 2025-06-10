"use client"
import { useContext } from "react"
import { ChangeContext } from "./ShippingDetails"

export default function ShippingFormInput({ name, placeholder, value }) {
    const onChange = useContext(ChangeContext)

    return (<input className="w-full p-2 border rounded"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />)
}