import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { API_URL, categories } from "../../Constants";
import chevron from "../../assets/forAll/chevron.svg";
import { UserLoggedInContext } from "../../contexts/Contexts";
import back from "../../assets/questions/angle-left.svg";

export default function ShowUnapprove() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const category = location.state?.category;
  const categoryName = location.state?.categoryName;
  const { currentWebUser } = useContext(UserLoggedInContext);

 
 
 
  

  const [unapprovedQuestions, setUnapprovedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const getUnapprovedData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/getAllUnapproveQuestions?category=${category}`
      );
      setUnapprovedQuestions(response.data);
      console.log("The data", response.data);
    } catch (error) {
      console.error("Error fetching unapproved questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentWebUser?.token) {
      getUnapprovedData();
    }
  }, [category, currentWebUser]);

  const handleDecline = async (data) => {
    try {
      await axios.delete(`${API_URL}/declineQuestion/${data._id}`);
      alert("Question deleted successfully");
      getUnapprovedData();

      axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Decline Question",  
        description: `${currentWebUser.firstName} declined the question "${data.question}".`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Try again.");
    }
  };

  const handleApprove = async (data) => {

    console.log("data",data);
    
    try {
      
      await axios.put(`${API_URL}/approveQuestion/${data._id}`);
      alert("Question approved successfully");
      axios.post(`${API_URL}/addLogs`, {
        name: `${currentWebUser.firstName} ${currentWebUser.lastName}`,
        branch: currentWebUser.branch,
        action: "Approve Question",  
        description: `${currentWebUser.firstName} approved the question "${data.question}".`,
        position: currentWebUser.position,
        useravatar: currentWebUser.useravatar,
      })
      getUnapprovedData();
    } catch (error) {
      console.error("Error approving question:", error);
      alert("Failed to approve question. Try again.");
    }
  };

  function handleBack() {
    navigate("/question", {
      state: {
        category: category,
        catSelected: categoryName,
        gotSelected: true,
        categoryName: categoryName,
      }
    })

  }

  return (
  <div className="w-full h-full flex flex-col bg-white p-3 overflow-y-auto">
    <div className="title-header mb-4">
      <div className="title-left">
        <button
          className="back-button cursor-pointer mt-5"
          onClick={handleBack}
        >
          <img src={back} alt="back arrow" className="back-icon" />
        </button>
        <h1 className="question-title">Unapprove Questions</h1>
      </div>
    </div>

   
    {unapprovedQuestions.length === 0 ? (
      <div className="w-full flex-1  flex justify-center items-center">
        <h1 className="text-gray-600 text-3xl mt-10 text-center">
          No unapproved questions
        </h1>
      </div>
      
    ) : (
      unapprovedQuestions.map((data, index) => (
        <div
          key={data._id || index}
          className="w-full h-auto grid grid-cols-[10fr_1fr] p-2 bg-white border-2 border-black rounded-xl mb-2 mt-10"
        >
          <div className="flex items-center">
            {index + 1}. {data.question}
          </div>

          <div className="flex items-center justify-end pr-10">
            <button
              onClick={() =>
                setActiveQuestion(activeQuestion === data._id ? null : data._id)
              }
              className="p-2 rounded cursor-pointer"
            >
              <img src={chevron} alt="Open details" className="w-5 h-5" />
            </button>
          </div>

          <div className="col-span-2">
            {activeQuestion === data._id && (
              <div className="w-full h-auto p-4 mt-2 rounded bg-white shadow">
                <p>
                  {categories.find((cat) => cat.id === data.category)?.name}
                </p>

                {data.choices.map((choice, i) => (
                  <div key={i} className="mb-2">
                    <input
                      type="radio"
                      name={`question-${data._id}`}
                      value={choice.letter}
                      disabled
                      className="mr-2"
                      checked={choice.letter === data.answer}
                    />
                    {choice.letter}. {choice.text} ---- {choice.rationale}
                  </div>
                ))}

                <p>Level: {data.level}</p>
                <p>Rationale: {data.rationale}</p>
                <p>Difficulty: {data.difficulty}</p>
                <p>Timer: {data.timer}</p>

                <div className="flex w-full gap-40 justify-center items-center mt-4">
                  <button
                    className="w-40 h-12 bg-green-200 rounded-xl"
                    onClick={() => handleApprove(data)}
                  >
                    Approve
                  </button>
                  <button
                    className="w-40 h-12 bg-red-200 rounded-xl"
                    onClick={() => handleDecline(data)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))
    )}
  </div>
);

}
