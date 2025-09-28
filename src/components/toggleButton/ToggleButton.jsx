import { useContext } from "react"
import { ActiveContext } from "../../contexts/Contexts"



export default function ToggleButton({showLeftChoice, showRightChoice, useStateToShow, textLeftChoice, textRightChoice, id}) {
    
  const { divColor} = useContext(ActiveContext)
  
  return(
        <>
            <div className={`${id === "glossary" ? "w-[250px]" : "w-full"} h-[80px] flex justify-between items-center`}>
              <div 
                className="flex justify-between bg-gray-100 rounded-xl w-[400px]"
                style={{backgroundColor: divColor}}
              >
                <button
                  onClick={showLeftChoice}
                  className={`w-1/2 py-3 rounded-xl font-medium transition cursor-pointer ${
                    !useStateToShow
                      ? "bg-white !text-[#000000] shadow"
                      : "!text-gray-400 hover:bg-gray-300"
                  }`}
                >
                  {textLeftChoice}
                </button>

                <button
                  onClick={showRightChoice}
                  className={`w-1/2 py-3 rounded-xl font-medium transition cursor-pointer  ${
                    useStateToShow
                      ? "bg-white !text-[#000000] shadow "
                      : "!text-gray-400 hover:bg-gray-300"
                  }`}
                >
                  {textRightChoice}
                </button>
              </div>

              
            </div>
        </>
    )
}