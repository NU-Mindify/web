import { useEffect, useState } from "react"
import '../../css/account//account.css'
import axios from 'axios';
import { API_URL } from '../../Constants';
import { useNavigate } from "react-router";


export default function AccountManagement(){

    const [webusers, setWebUsers] = useState([])
    const navigate = useNavigate()


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
            console.log(error)
         });
    };

    return(
        <>
            <div className="acc-main-container">
            {webusers.map((admin, index) => {
                return (
                    <div key={index}>
                        <h1>{admin.firstName}</h1>
                        <h1>{admin.lastName}</h1>
                        <h1>{admin.email}</h1>
                    </div>
                );
            })}

            
            <button onClick={() => navigate('/addaccount')} className="btn btn-success">Add Account</button>
            </div>
        </>
    )
}