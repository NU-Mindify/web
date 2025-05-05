import { useEffect, useState } from "react";
import "../../css/account/account.css";
import axios from "axios";
import { API_URL, branches } from "../../Constants";
import { useNavigate } from "react-router";
import search from "../../assets/students/search-01.svg";
import chevron from "../../assets/glossary/dropdown.svg";
import settings from "../../assets/students/settings.svg";

export default function AccountManagement() {
    const [webusers, setWebUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardActive, setCardActive] = useState(null);
    const [searchUser, setSearchUser] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/getWebUsers`)
            .then((res) => setWebUsers(res.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchUser]);

    const usersPerPage = 10;
    const filteredUsers = webusers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchUser.toLowerCase())
    );
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const toggleCard = (id) => {
        setCardActive((prev) => (prev === id ? null : id));
    };

    return (
        <div className="account-main-container">
            {/* Header */}
            <div className="account-header">
                <h1 className="account-title">Account Management</h1>
                <div className="acc-search-bar">
                    <img src={search} className="search-icon" alt="search icon" />
                    <input
                        type="text"
                        className="acc-search-input"
                        placeholder="Search for a student"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                    />
                </div>
            </div>

            {/* Column titles */}
            <div className="titles-container">
                <div className="header-info">
                    <h1 className="title-info">Name</h1>
                    <h1 className="title-info">Position</h1>
                    <h1 className="title-info">Branch</h1>
                    <h1 className="title-info">Action</h1>
                </div>
            </div>

            {/* User list */}
            <div className="users-container">
                {currentUsers.length > 0 ? (
                    currentUsers.map((admin) => (
                        <div
                            key={admin.employeenum}
                            className={cardActive === admin.employeenum ? "active-user-card" : "user-card"}
                        >
                            <div className="name-img-container">
                                <img src={admin.useravatar} alt={admin.firstName} className="mini-avatar" />
                                <h1 className="admin-info">
                                    {admin.firstName} {admin.lastName}
                                </h1>
                            </div>

                            <h1 className="admin-info">{admin.position}</h1>
                            <h1 className="admin-info">
                                {branches.find((branch) => branch.id === admin.branch)?.name || "Unknown Branch"}
                            </h1>

                            <div className="action-container">
                                <img src={settings} alt="settings" className="setting-icon" />
                                <img
                                    src={chevron}
                                    alt="chevron"
                                    onClick={() => toggleCard(admin.employeenum)}
                                    className={`w-[35px] h-[35px] cursor-pointer transform transition-transform duration-500 origin-center ${
                                        cardActive === admin.employeenum ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-white text-xl mt-10">No users found.</div>
                )}
            </div>

            {/* Footer */}
            <div className="acc-footer">
                <div className="pagination-container">
                    <h1 className="text-black">
                        Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * usersPerPage + 1} to{" "}
                        {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length}
                    </h1>

                    <div className="join">
                        <button
                            className="join-item btn bg-white text-black"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>
                        <button className="join-item btn bg-white text-black" disabled>
                            Page {currentPage}
                        </button>
                        <button
                            className="join-item btn bg-white text-black"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            »
                        </button>
                    </div>
                </div>

                <div className="add-user-container">
                    <button onClick={() => navigate("/addaccount")} className="btn btn-success">
                        Add Account
                    </button>
                </div>
            </div>
        </div>
    );
}
