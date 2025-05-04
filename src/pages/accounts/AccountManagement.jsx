import { useEffect, useState } from "react"
import '../../css/account//account.css'
import axios from 'axios';
import { API_URL } from '../../Constants';
import { useNavigate } from "react-router";
import search from "../../assets/students/search-01.svg";
import filter from "../../assets/students/filter.svg";
import chevron from "../../assets/glossary/dropdown.svg";
import settings from "../../assets/students/settings.svg";


export default function AccountManagement(){

    const [webusers, setWebUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardActive, setCardActive] = useState('');
    const [searchUser, setSearchUser] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchWebUsers();
    }, []);

    const fetchWebUsers = () => {
        axios.get(`${API_URL}/getWebUsers`)
            .then((response) => {
                console.log(response.data);
                setWebUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const usersPerPage = 5;

    const filteredUsers = webusers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchUser.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleDropdown = (id) => {
        setCardActive(cardActive === id ? null : id);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchUser]);



    

    function AccountCard({ id, fname, lname, branch, position, image, onClick, cardActive }) {
        return (
            <div className={cardActive === id ? 'active-user-card' : 'user-card'} key={id}>
                <div className="name-img-container">
                    <img src={image} alt={fname} className="mini-avatar" />
                    <h1 className="admin-info">{fname} {lname}</h1>
                </div>
                
                <h1 className="admin-info">{position}</h1>
                <h1 className="admin-info">{branch}</h1>
                <div className="action-container">
                    <img src={settings} alt="settings" className="setting-icon" />
                    <img src={chevron} alt="settings" className="chevron-icon" onClick={() => onClick(id)} />
                </div>
            </div>
        )
    }







    return(
        <>
            <div className="account-main-container">
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
                        {/* <img src={filter} className="icon" alt="filter icon" /> */}
                    </div>
                    
                </div>

                <div className="titles-container">
                    <div className="header-info">
                        <h1 className="title-info">Name</h1>
                        <h1 className="title-info">Position</h1>
                        <h1 className="title-info">Branch</h1>
                        <h1 className="title-info">Action</h1>
                    </div>
                </div>
                

                <div className="users-container">
                {currentUsers && webusers.length > 0 ? (
                    currentUsers.map((admin) => (
                        <AccountCard 
                            key={admin.employeenum}
                            id={admin.employeenum} 
                            fname={admin.firstName} 
                            lname={admin.lastName}  
                            image={admin.useravatar}
                            branch={admin.branch}
                            position={admin.position}
                            onClick={handleDropdown}
                            cardActive={cardActive}
                        />
                    ))
                ) : (
                    <div className="text-white text-xl mt-10">No users found.</div>
                )}

                    
                    
                    
                </div>

                <div className="acc-footer">
                    <div className="pagination-container">
                        <div>
                            <h1 className="text-black">Page {currentPage} of {totalPages}</h1>
                        </div>
                        <div className="join">
                            <button
                                className="join-item btn bg-white text-black"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                            «
                            </button>
                            <button className="join-item btn bg-white text-black" disabled>
                                Page {currentPage}
                            </button>
                            <button
                                className="join-item btn bg-white text-black"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                            »
                            </button>
                        </div>
                    </div>

                    <div className="add-user-container">
                        <button onClick={() => navigate('/addaccount')} className="btn btn-success">Add Account</button>
                    </div>
                </div>
            </div>
        </>
    )
}



