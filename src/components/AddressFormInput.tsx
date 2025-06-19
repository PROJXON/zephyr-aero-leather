"use client"
import { useContext } from "react";
import { StatesContext } from "./Checkout";
import type { AddressFormChange } from "../../types/types";

export default function AddressFormInput({
  name,
  placeholder,
  value,
  span,
  error,
  type,
  onChange
}: {
  name: string;
  placeholder: string;
  value: string;
  span: number;
  error: string;
  type: "select" | "text";
  onChange: (event: AddressFormChange) => void;
}) {
  const states = useContext(StatesContext);
  const classes = `w-full p-4 border border-gray-300 rounded-md bg-white shadow-sm text-base text-gray-900 font-inherit placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-dark focus:border-neutral-dark transition-all${error ? " border-red-400 placeholder-red-300" : ""}`;
  const displayPlaceholder = error || placeholder;

  return (
    <div className={`col-span-${span}`}>
      {type === "select" ? (
        <select
          className={classes}
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="">{displayPlaceholder}</option>
          {states.map(state => <option key={state} value={state}>{state}</option>)}
        </select>
      ) : (
        <input
          className={classes}
          type={type}
          name={name}
          placeholder={displayPlaceholder}
          value={error ? "" : value}
          onChange={onChange}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}