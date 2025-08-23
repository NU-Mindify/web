import React from "react";
import "../OldPassModal/OldPasswordModal.css";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function OldPasswordModal({
  onClose,
  onSubmit,
  password,
  setPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[998]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-90 h-50 flex items-center justify-center flex-col animate-popup">
        <h2 className="text-black text-center font-[Poppins] mb-4">
          Confirm Old Password
        </h2>

        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter old password"
            className="w-full p-2 border border-black rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-3"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="flex-1 px-4 py-3 rounded-lg bg-[#FFC300] hover:bg-[#e6b200] text-black font-[Poppins] font-bold transition cursor-pointer"
            onClick={onSubmit}
          >
            Submit
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-black font-[Poppins] font-bold transition cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
