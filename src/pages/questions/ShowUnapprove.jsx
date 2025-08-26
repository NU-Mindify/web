import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { UserLoggedInContext } from "../../contexts/Contexts";
import { API_URL, categories } from "../../Constants";
import chevron from "../../assets/forAll/chevron.svg";

export default function ShowUnapprove() {
  const location = useLocation();
  const category = location.state?.category;
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


    const handleDecline = async (id) => {
    try {

      console.log("question id", id);
      await axios.delete(`${API_URL}/declineQuestion/${id}`);

      alert("Question deleted successfully");
      getUnapprovedData();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Try again.");
    }
  };

  return (
    <div className="w-full h-full bg-violet-200 p-3 overflow-y-auto">
      {unapprovedQuestions.map((data, index) => (
        <div
          key={data._id || index}
          className="w-full h-auto grid grid-cols-[10fr_1fr] p-2 bg-blue-300 mb-2"
        >

          <div className="flex items-center">
            {index + 1}. {data.question}
          </div>


          <div className="flex items-center justify-end pr-10">
            <button
              onClick={() =>
                setActiveQuestion(
                  activeQuestion === data._id ? null : data._id
                )
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
                  <button className="w-40 h-12 bg-green-200 rounded-xl">
                    Approve
                  </button>
                  <button 
                    className="w-40 h-12 bg-red-200 rounded-xl"
                    onClick={() => handleDecline(data._id)}
                >
                    Decline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
