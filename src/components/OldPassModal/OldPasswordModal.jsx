import React from "react";
import "../OldPassModal/OldPasswordModal.css";

export default function OldPasswordModal({
  onClose,
  onSubmit,
  password,
  setPassword,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-90 h-50 flex items-center justify-center flex-col animate-popup">
        <h2 className="text-black text-center font-[Poppins] mb-4">
          Confirm Old Password
        </h2>
        <input
          type="password"
          placeholder="Enter old password"
          className="w-full p-0.5 mt-1 border-solid text-black font-[Poppins] text-m"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="btn bg-[#35408E] hover:bg-[#FFBF1A] text-white font-[Poppins]"
            onClick={onSubmit}
          >
            Submit
          </button>
          <button className="btn btn-error text-white" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
