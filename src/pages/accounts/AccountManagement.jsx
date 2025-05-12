import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../css/account/account.css";
import { API_URL, branches } from "../../Constants";

import searchIcon from "../../assets/students/search-01.svg";
import chevronIcon from "../../assets/glossary/dropdown.svg";
import settingsIcon from "../../assets/students/settings.svg";

export default function AccountManagement() {
    const [webUsers, setWebUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardActive, setCardActive] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const usersPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_URL}/getWebUsers`);
                setWebUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredUsers = webUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const toggleCard = (id) => {
        setCardActive(prev => (prev === id ? null : id));
    };

    return (
        <div className="account-main-container">
            {/* Header */}
            <div className="account-header">
                <h1 className="account-title">Account Management</h1>
                <div className="acc-search-bar">
                    <img src={searchIcon} alt="Search" className="search-icon" />
                    <input
                        type="text"
                        className="acc-search-input"
                        placeholder="Search for a user"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Column Titles */}
            <div className="titles-container">
                <div className="header-info">
                    <h1 className="title-info">Name</h1>
                    <h1 className="title-info">Position</h1>
                    <h1 className="title-info">Branch</h1>
                    <h1 className="title-info">Action</h1>
                </div>
            </div>

            {/* User List */}
            <div className="users-container">
                {isLoading ? (
                    <div className="loading-overlay-students">
                        <div className="spinner"></div>
                        <p>Fetching data...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-black mt-10 text-3xl">No user found.</p>
                ) : (
                    currentUsers.map((user) => (
                        <div
                            key={user.employeenum}
                            className={cardActive === user.employeenum ? "active-user-card" : "user-card"}
                        >
                            <div className="name-img-container">
                                <img src={user.useravatar} alt={user.firstName} className="mini-avatar" />
                                <h1 className="admin-info">
                                    {user.firstName} {user.lastName}
                                </h1>
                            </div>
                            <h1 className="admin-info">{user.position}</h1>
                            <h1 className="admin-info">
                                {branches.find(b => b.id === user.branch)?.name || "Unknown Branch"}
                            </h1>
                            <div className="action-container">
                                <img src={settingsIcon} alt="settings" className="setting-icon" />
                                <img
                                    src={chevronIcon}
                                    alt="toggle details"
                                    onClick={() => toggleCard(user.employeenum)}
                                    className={`origin-center chevron-icon ${cardActive === user.employeenum ? "rotate-180" : ""}`}
                                />
                            </div>
                        </div>
                    ))
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
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage <= 1}
                        >
                            «
                        </button>
                        <button className="join-item btn bg-white text-black" disabled>
                            Page {currentPage}
                        </button>
                        <button
                            className="join-item btn bg-white text-black"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages}
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
