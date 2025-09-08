import React from "react";
import "../ValidationModal/validationmodal.css";
import { Info } from "lucide-react";

export default function ValidationModal({ message, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[999]"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-90 h-50 flex items-center justify-center flex-col animate-popup">
        <Info className="text-black mb-4" size={30} />
        <p className="text-black text-center font-[Poppins] mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 btn bg-[#FFBF1A] hover:brightness-105 !text-black font-[Poppins] w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClose(e);
            }
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
