import React from "react";
import "../OkCancelModal/okcancelmodal.css";
import { Info } from "lucide-react";

export default function OkCancelModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex items-center justify-center flex-col animate-popup">
        <Info className="text-black mb-4" size={30} />
        <p className="text-black text-center font-[Poppins] mb-4">{message}</p>

        <div className="flex gap-4 w-full">
          {/* OK Button */}
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-lg bg-[#FFC300] hover:bg-[#e6b200] text-black font-[Poppins] font-bold transition cursor-pointer"
          >
            OK
          </button>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-black font-[Poppins] font-bold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}