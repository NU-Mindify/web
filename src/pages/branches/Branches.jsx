import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL, fetchBranches } from "../../Constants";
import "../../css/branches/branches.css";
import "../../css/signUp/signUp.css";
import Buttons from "../../components/buttons/Buttons";
import ValidationModal from "../../components/ValidationModal/ValidationModal";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo/logo.png";
import { UserLoggedInContext } from "../../contexts/Contexts";
import submit from "../../assets/branches/submitButton.svg";
import reset from "../../assets/branches/resetButton.svg";

export default function Branches() {

  
  const [newBranch, setNewBranch] = useState({
    id: "",
    name: "",
    extension: "",
    is_deleted: false,
  });

  const [branchList, setBranchList] = useState([]);

  useEffect(() => {
    const loadBranches = async () => {
      const data = await fetchBranches();
      setBranchList(data);
    };
    loadBranches();
  }, []);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const { setCurrentWebUser, currentWebUser } = useContext(UserLoggedInContext);

  const handleReset = () => {
    setNewBranch({
      id: "",
      name: "",
      extension: "",
      is_deleted: false,
    });
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();

    if (!newBranch.id || !newBranch.name || !newBranch.extension) {
      setValidationMessage("All fields are required.");
      setShowValidationModal(true);
      return;
    }

    const isDuplicate = branchList.some((branch) => branch.id === newBranch.id);
    if (isDuplicate) {
      setValidationMessage("Branch ID already exists.");
      setShowValidationModal(true);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/addBranches`, newBranch);
      const addedBranch = response.data;

      setBranchList((prev) => [...prev, addedBranch]);
      setValidationMessage("Branch added successfully!");
      setShowValidationModal(true);
      handleReset();
    } catch (error) {
      console.error("Error adding branch:", error);
      setValidationMessage("Failed to add branch. Please try again.");
      setShowValidationModal(true);
    }
  };

  const exportBranchesToCSV = (branches, filename) => {
    if (!currentWebUser) {
      alert("User not found. Please log in.");
      return;
    }

    const now = new Date().toLocaleString();
    const headers = ["Branch ID", "Name", "Email Extension"];
    const rows = branches.map((branch) => [
      branch.id || "",
      branch.name || "",
      branch.extension || ""
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
        `Exported on: ${now}`,
        "",
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${filename}_by_${currentWebUser.firstName}_${currentWebUser.lastName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //convert logo to base64 para lumabas sa pdf
  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const exportBranchesToPDF = async (branches, title) => {
    if (!currentWebUser) {
      alert("User not found. Please log in.");
      return;
    }

    const logoBase64 = await getBase64FromUrl(logo);
    const now = new Date().toLocaleString();
    const doc = new jsPDF();

    doc.text(`${title}`, 14, 10);
    doc.text(
      `Exported by: ${currentWebUser.firstName} ${currentWebUser.lastName}`,
      14,
      18
    );
    doc.text(`Exported on: ${now}`, 14, 26);

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 15;
    const xPos = pageWidth - logoWidth - 10;
    doc.addImage(logoBase64, "PNG", xPos, 10, logoWidth, logoHeight);

    const rows = branches.map((branch) => [
      branch.id || "",
      branch.name || "",
      branch.extension || ""
    ]);

    autoTable(doc, {
      head: [["Branch ID", "Name", "Email Extension"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${currentWebUser.lastName}.pdf`
    );
  };


  return (
    <div className="campus-main-container">
      <div className="campus-header flex justify-between items-center">
        <h1 className="campus-title">Campus Management</h1>

        <ExportDropdown
          onExport={(format) => {
            if (format === "csv") {
              exportBranchesToCSV(branchList, "Branch_List");
            } else if (format === "pdf") {
              exportBranchesToPDF(branchList, "Branch_List");
            }
          }}
        />
      </div>


      <div className="px-5">

      <div className="campus-form-container">
        <h3 className="form-title">ADD CAMPUS</h3>
        <hr className="border-b border-gray-300 mb-4" />

        <div className="form-row">
          <div className="input-group">
            <label className="required-label"> Campus ID </label>
            <input
              type="text"
              placeholder="Enter Campus ID"
              value={newBranch.id}
              onChange={(e) => {
                const idValue = e.target.value;
                setNewBranch({
                  ...newBranch,
                  id: idValue,
                });
              }}
            />
          </div>

          <div className="input-group">
            <label className="required-label">Campus Name</label>
            <input
              type="text"
              placeholder="Enter Campus Name"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label className="required-label">Email Extension</label>
            <input
              type="text"
              value={newBranch.extension}
              onChange={(e) =>
                setNewBranch({ ...newBranch, extension: e.target.value })
              }
              placeholder="Enter Email Extension"
            />
          </div>
        </div>

        <div className="button-row">
          {/* <Buttons
            onClick={handleAddBranch}
            text={"Submit"}
            disabled={false}
            addedClassName="btn btn-success"
          /> */}
          <button className="cursor-pointer"
             onClick={handleAddBranch}
             disabled={false}
           >
             <img src={submit} alt="submit-btn-icon"/>
          </button>

          {/* <Buttons
            onClick={handleReset}
            text={"Reset"}
            // disabled={isLoading}
            addedClassName="btn btn-warning ml-5"
          /> */}
          <button className="cursor-pointer"
            onClick={handleReset}
          >
            <img src={reset} alt="reset-btn-icon"/>
          </button>
        </div>
      </div>
      </div>


      {branchList.length > 0 && (
        <div className="campuses-main-container px-10">
          <div className="campus-header font-bold text-[20px] flex justify-between items-center pb-2 mb-2 mt-5">
            <div className="w-[25%]">Branch ID</div>
            <div className="w-[35%]">Name</div>
            <div className="w-[42%]">Email Extension</div>
          </div>

          <div className="campus-scroll-container max-h-[250px] overflow-y-auto pr-2 bg-white rounded-md">
            {branchList.map((branch, index) => (
              <div
                key={index}
                className="campus-card flex justify-between items-center px-5 py-4 mb-3 border border-gray-600 rounded-lg bg-white text-black"
              >
                <div className="w-[25%] text-[17px] font-medium">{branch.id}</div>
                <div className="w-[35%] text-[17px]">{branch.name}</div>
                <div className="w-[40%] text-[17px]">{branch.extension}</div>
              </div>
            ))}
          </div>
        </div>
      )}



    
      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidationModal(false)}
        />
      )}
    </div>
  );
}
