import samplepic from "../../assets/students/sample-minji.svg";
import chevronIcon from "../../assets/forAll/chevron.svg";

import { avatars } from "../../Constants";
import { Archive, ArchiveRestore } from "lucide-react";
import "./userContentsTable.css";
import defaultAvatar from "../../assets/defaultAvatar/defaultAvatar.svg";

export default function UserContentsTable({
  columns,
  titles,
  data,
  isLoading,
  cardActive,
  toggleCard,
  sortOrderAsc,
  setSortOrderAsc,
  getBranchName,
  cardActiveContent,
  isForApprove,
  onArchiveClick,
}) {
  return (
    <div className="users-main-container">
      <div className="w-full bg-white flex justify-center items-center sticky top-0 z-10">
        <div className="w-11/12 h-[50px] flex">
          {titles.map(({ key, label, className }) => (
            <div
              key={key}
              className={`${
                className || ""
              } text-xl text-black font-bold flex items-center`}
            >
              {label}
              {key === "name" && (
                <button
                  onClick={() => setSortOrderAsc((prev) => !prev)}
                  className="text-black cursor-pointer ml-3"
                >
                  <img
                    src={chevronIcon}
                    alt="chevron"
                    className={`w-4 transition-transform ${
                      sortOrderAsc ? "" : "rotate-180"
                    }`}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-11/12 h-[50px] text-left min-w-[900px]">
        {isLoading ? (
          <div className="loading-overlay-accounts">
            <div className="spinner"></div>
            <p>Fetching data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full flex flex-grow justify-center items-center">
            <p className="text-black mt-10 text-3xl">No user found.</p>
          </div>
        ) : (
          data.map((user) => {
            const userId = user.uid || user.student_id || user._id;

            return (
              <div
                key={userId}
                className={
                  cardActive === userId ? "active-user-card" : "user-card"
                }
              >
                <div className="w-full min-w-[900px] flex justify-between text-xl">
                  {titles.map(({ key }) => {
                    switch (key) {
                      case "name":
                        return (
                          <div
                            key={key}
                            className="flex-grow flex items-center"
                          >
                            <img
                              src={
                                user.useravatar ||
                                avatars[user.avatar] ||
                                samplepic
                              }
                              alt={user.firstName || user.first_name}
                              className="mini-avatar"
                            />
                            {(user.lastName || user.last_name)?.toUpperCase()},{" "}
                            {user.firstName || user.first_name}
                          </div>
                        );
                      case "position":
                        return (
                          <div key={key} className="user-pos-cell">
                            {user.position}
                          </div>
                        );
                      case "branch":
                        return (
                          <div key={key} className="user-branch-cell">
                            {getBranchName(user.branch)}
                          </div>
                        );
                      case "email":
                        return <div key={key}>{user.email}</div>;
                      case "action":
                        return (
                          <div key={key} className="user-action-cell">
                            <div
                              className={
                                isForApprove
                                  ? "flex justify-end pr-10"
                                  : "action-holder"
                              }
                            >
                              {!isForApprove && (
                                <button
                                  type="button"
                                  className="archive-icon bg-transparent border-none p-0"
                                  aria-label={
                                    user.is_deleted
                                      ? "Unarchive user"
                                      : "Archive user"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onArchiveClick &&
                                      onArchiveClick(
                                        user,
                                        user.is_deleted
                                          ? "unarchive"
                                          : "archive"
                                      );
                                  }}
                                >
                                  {user.is_deleted ? (
                                    <ArchiveRestore
                                      size={20}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <Archive
                                      size={20}
                                      className="text-red-500"
                                    />
                                  )}
                                </button>
                              )}

                              <button
                                type="button"
                                className={`acc-chevron transition-transform duration-300 ${
                                  cardActive === userId
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                                aria-label="Toggle details"
                                onClick={() => toggleCard(userId)}
                              >
                                <img
                                  src={chevronIcon}
                                  alt="toggle details"
                                  className="chevron-icon"
                                />
                              </button>
                            </div>
                          </div>
                        );
                      case "stud_id":
                        return (
                          <div key={key} className="user-pos-cell">
                            {user.student_id}
                          </div>
                        );
                      default:
                        return <div key={key}>N/A</div>;
                    }
                  })}

                  
                </div>
                <div className="w-full">
                    {cardActive === userId && cardActiveContent(user)}
                  </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
