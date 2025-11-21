"use client";
import React, { useState, useEffect} from "react";
import type { JSX } from "react";
import holster from '../../public/categories/holster.jpg';
import Image from "next/image";
import Link from "next/link";


export default function AdPopup(): JSX.Element | null {

  const [popUp, setPopUp] = useState<boolean>(true);

  //add a keydown litener to close the popup when escape key is pressed
  useEffect(()=>{
    function handleKeyDown(keyEvent: KeyboardEvent){
      if(keyEvent.key === "Escape"){
        setPopUp(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  },[]);


  if (!popUp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 "
    onClick={() => setPopUp(false)}
    aria-label="Advertisement Popup">
      {/* Popup content container */}
    <div className="relative bg-white p-4 rounded-lg shadow-lg items-center justify-center max-w-md"
    onClick={(e) => e.stopPropagation()}
    aria-label="Advertisement Content">
      <button
        onClick={() => setPopUp(false)}
        className="absolute top-2 right-2 text-black font-bold px-2"
        aria-label="Close Advertisement">
        x
      </button>
    <div className="space-y-4 grid grid-cols-2 items-center text-center"
    aria-label="Advertisement Details">
        <div aria-label="Advertisement Text">
        <h1 className="font-normal text-2xl md:text-3xl text-neutral-dark uppercase tracking-wide px-3 py-1 inline-block animate-pulse"
        aria-label="Advertisement Heading">
            CHECK OUT NEW ITEM
        </h1>
        <p className="p-4 md:p-6 text-gray-700 text-base md:text-lg leading-relaxed font-light mb-6"
        aria-label="Advertisement Description">
            <span className="block text-lg md:text-xl font-normal">
                The all-in-one <span className="font-semibold">holster</span>.
            </span>
            <span className="block mt-2 text-sm md:text-base text-gray-800 font-light">
                Carry your essentials in style always ready to go.
            </span>
        </p>
        <Link 
        href={`/product/641`} className="inline-block mt-2 bg-black text-white px-4 py-2 rounded transition-colors duration-150 ease-in-out hover:bg-gray-800"
        aria-label="Shop now for the holster">
        Shop now
        </Link>
            </div>
            <div>
            <Link href={`/product/641`} className="w-full h-full block"
            aria-label="Leather Shoulder Holster Image Link">
            <Image  
                src={holster}
                alt="Leather Shoulder Holster"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
            />  
            </Link>
            </div>
    </div>
    </div>
    </div>
  );
}
