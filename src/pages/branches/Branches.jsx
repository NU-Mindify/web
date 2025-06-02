import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, fetchBranches } from "../../Constants";
import "../../css/branches/branches.css";
import "../../css/signUp/signUp.css";
import Buttons from "../../components/buttons/Buttons";
import ValidationModal from "../../components/ValidationModal/ValidationModal";

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

  return (
    <div>
      <div>
        <h1>Branch Management</h1>
      </div>

      <div className="user-details-container">
        <div className="input-holder">
          <h1>Branch ID*</h1>
          <input
            type="text"
            placeholder="Branch ID"
            value={newBranch.id}
            onChange={(e) => {
              const idValue = e.target.value;
              setNewBranch({
                ...newBranch,
                id: idValue,
                extension: `@nu-${idValue}.edu.ph`,
              });
            }}
          />
        </div>

        <div className="input-holder">
          <h1>Branch Name*</h1>
          <input
            type="text"
            placeholder="Branch Name"
            value={newBranch.name}
            onChange={(e) =>
              setNewBranch({ ...newBranch, name: e.target.value })
            }
          />
        </div>

        <div className="input-holder">
          <h1>Branch Email Extension*</h1>
          <input
            type="text"
            placeholder="Branch Email Extension"
            value={`@nu-${newBranch.id}.edu.ph`}
            readOnly
          />
        </div>

        <div className="buttons-container">
          <Buttons
            onClick={handleAddBranch}
            text={"Submit"}
            disabled={false}
            addedClassName="btn btn-success"
          />

          <Buttons
            onClick={handleReset}
            text={"Reset"}
            // disabled={isLoading}
            addedClassName="btn btn-warning ml-5"
          />
        </div>

        {branchList.length > 0 && (
          <div className="branches-table-container">
            <h2>Existing Branches</h2>
            <table className="branches-table text-black">
              <thead>
                <tr>
                  <th>Branch ID</th>
                  <th>Name</th>
                  <th>Email Extension</th>
                  {/* <th>Added Date</th> */}
                </tr>
              </thead>
              <tbody className="text-white">
                {branchList.map((branch, index) => (
                  <tr key={index}>
                    <td>{branch.id}</td>
                    <td>{branch.name}</td>
                    <td>{branch.extension}</td>
                    {/* <td>{branch.createdAt}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showValidationModal && (
        <ValidationModal
          message={validationMessage}
          onClose={() => setShowValidationModal(false)}
        />
      )}
    </div>
  );
}
