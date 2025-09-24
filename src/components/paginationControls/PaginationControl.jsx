import { useContext } from "react";
import { ActiveContext } from "../../contexts/Contexts";

export default function PaginationControl({
  currentPage,
  totalItems,
  goToPrevPage,
  goToNextPage,
}) {
  const { theme } = useContext(ActiveContext);
  return (
    <>
      <div className="w-full h-[80px] flex items-center justify-between px-10">
        <h1
          className={`${theme === "#202024" ? "!text-white" : "!text-black"}`}
        >
          {totalItems === 0 ? (
            <>Showing 0 of 0</>
          ) : (
            <>
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, totalItems)} of {totalItems}
            </>
          )}
        </h1>

        <div className="join">
          <button
            className={`join-item btn ${
              theme === "#202024" ? "!text-white" : "!text-black"
            }`}
            style={{ backgroundColor: theme }}
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
          >
            «
          </button>
          <button
            className={`join-item btn ${
              theme === "#202024" ? "!text-white" : "!text-black"
            }`}
            style={{ backgroundColor: theme }}
            disabled
          >
            Page {currentPage} of {Math.ceil(totalItems / 10) || 1}
          </button>
          <button
            className={`join-item btn ${
              theme === "#202024" ? "!text-white" : "!text-black"
            }`}
            style={{ backgroundColor: theme }}
            onClick={goToNextPage}
            disabled={currentPage >= Math.ceil(totalItems / 10)}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}
