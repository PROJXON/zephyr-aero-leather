"use client"
import { useContext } from "react"
import { ChangeContext, StatesContext } from "./Checkout"
import type { AddressFormInputProps } from "../../types/types";

export default function AddressFormInput({ name, placeholder, value, span, error, type = "text" }: AddressFormInputProps) {
    const onChange = useContext(ChangeContext)
    const states = useContext(StatesContext)
    const classes = `w-full p-2 border rounded col-span-${span}${error ? " border-red-400 placeholder-red-300" : ""}`
    const displayPlaceholder = error || placeholder

    return (<>
        {type === "select" ? (<select
            className={classes}
            name={name}
            value={value}
            onChange={onChange}
        >
            <option value="">{displayPlaceholder}</option>
            {states.map(state => <option key={state} value={state}>{state}</option>)}
        </select>) : (<input
            className={classes}
            type={type}
            name={name}
            placeholder={displayPlaceholder}
            value={error ? "" : value}
            onChange={onChange}
        />)}
    </>)
}