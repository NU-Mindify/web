import React from "react";
import '../ValidationModal/validationmodal.css'

export default function ValidationModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-90 h-50 flex items-center justify-center flex-col animate-popup">
        <p className="text-black text-center font-[Poppins] mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 btn bg-[#35408E] hover:bg-[#FFBF1A] text-white font-[Poppins] w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}