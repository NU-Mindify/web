import React from "react";
import "../../css/profile/profile.css";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function NewPasswordModal({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onClose,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[998]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center animate-popup">
        <h2 className="text-black text-xl font-[Poppins] mb-4 font-bold">
          Change Password
        </h2>

        {/* New Password */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full p-2 border border-black rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-3"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative w-full mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full p-2 border border-black rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-3"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex gap-4 w-full">
          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-3 rounded-lg bg-[#FFC300] hover:bg-[#e6b200] text-black font-[Poppins] font-bold transition cursor-pointer"
          >
            Submit
          </button>
        
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-[Poppins] font-bold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
