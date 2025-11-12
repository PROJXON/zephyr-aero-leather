"use client";
import React, { useState } from "react";
import type { JSX } from "react";
import holster from '../../public/categories/holster.jpg';


export default function AdPopup(): JSX.Element | null {
  const [popUp, setPopUp] = useState<boolean>(true);

  if (!popUp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Popup content container */}
    <div className="fixed insert-0  bg-white p-4 rounded-lg shadow-lg items-center justify-center max-w-md ">
      <button
        onClick={() => setPopUp(false)}
        className="absolute top-2 right-2 text-black font-bold px-2">
        ✕
      </button>
    <div className="space-y-4 grid grid-cols-2 items-center text-center">
        <div>
        <h1 className="font-normal text-2xl md:text-3xl text-neutral-dark uppercase tracking-wide px-3 py-1 inline-block animate-pulse">
            CHECK OUT NEW ITEM
        </h1>
        <p className="p-4 md:p-6 text-gray-700 text-base md:text-lg leading-relaxed font-light mb-6">
            <span className="block text-lg md:text-xl font-normal">
                The all-in-one <span className="font-semibold">holster</span>.
            </span>
            <span className="block mt-2 text-sm md:text-base text-gray-800 font-light">
                Carry your essentials in style always ready to go.
            </span>
        </p>
        <a href="/product/641" className="inline-block mt-2 bg-black text-white px-4 py-2 rounded">
        Shop now
        </a>
            </div>
            <a href="/product/641" className=" "> 
                <img  src={holster.src}
                alt="Leather Shoulder Holster"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"/> 
            </a>
    </div>
    </div>
    </div>
  );
}
