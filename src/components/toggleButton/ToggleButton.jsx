export default function ToggleButton({showLeftChoice, showRightChoice, useStateToShow, textLeftChoice, textRightChoice}) {
    return(
        <>
            <div className="w-full h-[80px] flex justify-between items-center px-10">
              <div className="flex justify-between bg-gray-100 rounded-xl w-[400px]">
                <button
                  onClick={showLeftChoice}
                  className={`w-1/2 py-3 rounded-xl font-medium transition cursor-pointer ${
                    !useStateToShow
                      ? "bg-white !text-[#273574] shadow"
                      : "!text-gray-400 hover:bg-gray-300"
                  }`}
                >
                  {textLeftChoice}
                </button>

                <button
                  onClick={showRightChoice}
                  className={`w-1/2 py-3 rounded-xl font-medium transition cursor-pointer  ${
                    useStateToShow
                      ? "bg-white !text-[#273574] shadow "
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