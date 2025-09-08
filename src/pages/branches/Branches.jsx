import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Info } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo/logo.png";
import ExportDropdown from "../../components/ExportDropdown/ExportDropdown";
import ValidationModal from "../../components/ValidationModal/ValidationModal";
import { API_URL, fetchBranches, fetchDeletedBranches } from "../../Constants";
import { UserLoggedInContext } from "../../contexts/Contexts";
import "../../css/branches/branches.css";
import "../../css/signUp/signUp.css";

import { Archive, ArchiveRestore } from "lucide-react";

export default function Branches() {
  const [newBranch, setNewBranch] = useState({
    id: "",
    name: "",
    extension: "",
    stud_extension: "",
    is_deleted: false,
  });

  const [branchList, setBranchList] = useState([]);

  const [showDeletedBranches, setShowDeletedBranches] = useState(false);

  const loadBranches = async () => {
    try {
      const data = showDeletedBranches
        ? await fetchDeletedBranches()
        : await fetchBranches();
      setBranchList(data);
    } catch (error) {
      console.error("Error loading branches:", error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [showDeletedBranches]);

  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const { currentWebUser } = useContext(UserLoggedInContext);

  const handleReset = () => {
    setNewBranch({
      id: "",
      name: "",
      extension: "",
      stud_extension: "", 
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

    const idRegex = /^[A-Za-z]+$/;
    if (!idRegex.test(newBranch.id)) {
      setValidationMessage(
        "Branch ID can only contain letters (no numbers or special characters)."
      );
      setShowValidationModal(true);
      return;
    }

    if (!newBranch.extension.startsWith("@")) {
      setValidationMessage("Email extension must start with '@'.");
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
      axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Add Branch",
        description: `${currentWebUser.firstName} added the branch ${newBranch.name}.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })

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
      branch.extension || "",
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
      branch.extension || "",
    ]);

    autoTable(doc, {
      head: [["Branch ID", "Name", "Email Extension"]],
      body: rows,
      startY: 30,
    });

    doc.save(
      `${title.replace(" ", "_")}_by_${currentWebUser.firstName}_${
        currentWebUser.lastName
      }.pdf`
    );
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("")

  const [showActivateModal, setShowActivateModal] = useState(false);
  const [branchToActivate, setBranchToActivate] = useState(null);

  async function deleteBranch(branchId) {

    try {
      await axios.put(`${API_URL}/deleteBranch?id=${branchId}`);
      setValidationMessage("Branch deleted successfully.");
      setShowValidationModal(true);

      axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Delete Branch",
        description: `${currentWebUser.firstName} deleted the branch ${selectedBranch}.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })

      loadBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  }

  async function activateBranch(branchId) {

    try {
      await axios.put(`${API_URL}/activateBranch?id=${branchId}`);
      setValidationMessage("Branch activated successfully.");
      setShowValidationModal(true);
 
      axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Activate Branch",  
        description: `${currentWebUser.firstName} activated the branch ${selectedBranch}.`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })

      loadBranches();
    } catch (error) {
      console.error("Error activating branch:", error);
    }
  }

  return (
    <div className="campus-main-container">
      <div className="campus-header flex justify-between items-center">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold !text-[#FFC916] h-[50px] pl-3 mt-3 "
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Manage Campus
          </h1>
   

        <ExportDropdown
          onExport={(format) => {
            if (format === "csv") {
              exportBranchesToCSV(branchList, "Campus_List");
            } else if (format === "pdf") {
              exportBranchesToPDF(branchList, "Campus_List");
            }
          }}
        />
      </div>

      <div className="px-5">
        <div className="campus-form-container">
          <h2 className="form-title">ADD CAMPUS</h2>
          <hr className="border-b border-gray-300 mb-4" />

          <div className="form-row">
            <div className="input-group">
              <h2 className="required-label"> Campus ID </h2>
              <input
                type="text"
                placeholder="Enter Campus ID"
                value={newBranch.id}
                onChange={(e) => {
                  setNewBranch({
                    ...newBranch,
                    id: e.target.value,
                  });
                }}
              />
            </div>

            <div className="input-group">
              <h2 className="required-label">Campus Name</h2>
              <input
                className=""
                type="text"
                placeholder="Campus Name"
                value={newBranch.name}
                onChange={(e) => {
                  setNewBranch({
                    ...newBranch,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            <div className="input-group">
              <h2 className="required-label">
                Professor Email Extension
              </h2>
              <input
                className=""
                type="text"
                placeholder="Professor Email Extension"
                value={newBranch.extension}
                onChange={(e) => {
                  setNewBranch({
                    ...newBranch,
                    extension: e.target.value,
                  });
                }}
              />
            </div>

            <div className="input-group">
              <h2 className="required-label">Student Email Extension</h2>
              <input
                className=""
                type="text"
                placeholder="Student Email Extension"
                value={newBranch.stud_extension}
                onChange={(e) => {
                  setNewBranch({
                    ...newBranch,
                    stud_extension: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="button-row">
            {/* <Buttons
            onClick={handleAddBranch}
            text={"Submit"}
            disabled={false}
            addedClassName="btn btn-warning"
          /> */}
            <button
              onClick={handleAddBranch}
              className="w-[200px]  sm:w-[180px] py-3 sm:py-5 text-base sm:text-2xl rounded-2xl font-extrabold transition bg-[#FFC300] text-black hover:brightness-105 cursor-pointer"
              disabled={false}
            >
              Submit
            </button>

            {/* <Buttons
            onClick={handleReset}
            text={"Reset"}
            // disabled={!newBranch.id && !newBranch.name && !newBranch.extension}
            addedClassName="btn btn-warning ml-5"
          /> */}
            <button
              className={`w-[200px] sm:w-[180px] py-3 sm:py-5 text-base sm:text-2xl rounded-2xl font-extrabold transition ${
                newBranch.id || newBranch.name || newBranch.extension
                  ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                  : "bg-red-300 cursor-not-allowed"
              } text-black`}
              onClick={handleReset}
              disabled={
                !newBranch.id && !newBranch.name && !newBranch.extension
              }
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-5 ml-4">
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-[350px]">
          <button
            onClick={() => setShowDeletedBranches(false)}
            className={`w-1/2 py-2 rounded-lg font-medium transition ${
              !showDeletedBranches
                ? "bg-white !text-[#273574] shadow"
                : "!text-gray-400"
            }`}
          >
            Active Campuses
          </button>

          <button
            onClick={() => setShowDeletedBranches(true)}
            className={`w-1/2 py-2 rounded-lg font-medium transition ${
              showDeletedBranches
                ? "bg-white !text-[#273574] shadow"
                : "!text-gray-400"
            }`}
          >
            Deleted Campuses
          </button>
        </div>
      </div>



      {branchList.length > 0 && (
        <div className="campus-main-container min-h-screen flex flex-col">
          <div className="campus-header font-bold text-[20px] flex justify-between items-center pb-2 mb-2 mt-5">
            <div className="w-[25%]">Campus ID</div>
            <div className="w-[30%]">Name</div>
            <div className="w-[35%]">Professor Email Extension</div>
            <div className="w-[30%]">Student Email Extension</div>
            <div className="w-[10%]">Action</div>
          </div>

          <div className="campus-scroll-container overflow-x-auto overflow-y-auto max-h-[70vh] pr-2 bg-white rounded-md mb-10">
            <div className="w-full">
              {branchList.map((branch, index) => (
                <div
                  key={index}
                  className="campus-card flex flex-wrap md:flex-nowrap justify-between items-center px-3 md:px-5 py-4 mb-3 border border-gray-600 rounded-lg bg-white text-black"
                >
                   <div className="w-full md:w-[21%] text-sm md:text-[17px] font-medium">{branch.id}</div>
                  <div className="w-full md:w-[30%] text-sm md:text-[17px]">{branch.name}</div>
                  <div className="w-full md:w-[30%] text-sm md:text-[17px]">{branch.extension}</div>
                  <div className="w-full md:w-[30%] text-sm md:text-[17px]">{branch.stud_extension}</div>
                  <div className="w-full md:w-[5%] mt-2 md:mt-0">
                    {showDeletedBranches ? (
                      <button
                        onClick={() => {
                          setShowActivateModal(true);
                          setSelectedBranch(branch.name)
                          setBranchToActivate(branch._id);
                          
                          // className="btn btn-success px-5 py-2 text-white"
                        }}
                        
                      >
                        <ArchiveRestore size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setBranchToDelete(branch._id);
                          setSelectedBranch(branch.name)
                          setShowDeleteModal(true);

                          // className="btn btn-error px-5 py-2 m"
                        }}
                      
                      >
                         <Archive size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidationModal(false)}
        />
      )}

      {showDeleteModal && (
        <div className="w-full h-full fixed top-0 left-0 z-[5000] bg-gray-300/50 flex justify-center items-center">
          <div className="w-auto h-[200px] bg-white flex flex-col items-center px-10 py-5">
            <Info className="text-black mb-4" size={30} />
            <p className="text-black text-center font-[Poppins] mb-4">
              Are you sure you want to delete this campus?
            </p>

            <div className="w-full flex justify-evenly mt-5">
              <button
                className="btn btn-delete px-10 py-5 text-2xl"
                onClick={() => {
                  deleteBranch(branchToDelete); 
                  setShowDeleteModal(false); 
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-cancel px-10 py-5 text-2xl"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showActivateModal && (
        <div className="w-full h-full fixed top-0 left-0 z-[5000] bg-gray-300/50 flex justify-center items-center">
          <div className="w-auto h-[200px] bg-white flex flex-col items-center px-10 py-5">
            <Info className="text-black mb-4" size={30} />
            <p className="text-black text-center font-[Poppins] mb-4">
              Are you sure you want to activate this campus?
            </p>

            <div className="w-full flex justify-evenly mt-5">
              <button
                className="btn btn-delete px-10 py-5 text-2xl "
                onClick={() => {
                  activateBranch(branchToActivate);
                  setShowActivateModal(false); 
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-cancel px-10 py-5 text-2xl"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
