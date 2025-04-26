import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../Constants';

import '../../css/leaderboard/leaderboards.css' //temporary langs



export default function ManageStudents(){
    const [students, setStudents] = useState([]);

    useEffect(()=>{
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get(`${API_URL}/getUsers`)
        .then((response) => {
            console.log(response.data);
            setStudents(response.data);
            
        })
        .catch((error)=>{
            console.log(error);
        });
    };

    return(
        <>
           <h1>Manage Students</h1> 
           <div className='leaderboard-contents-container'>
                <div className='content-header'>
                    <h1 className='title-header'>Name</h1>
                    <h1 className='title-header'>Branch</h1>
                </div>
                <div className='leaders-main-container'>
                    {students.map(student => (
                        <div key={student._id} className='leaders-container'>
                            <h1 className='leader-info'>{student.username}</h1>
                            <h1 className='leader-info'>{student.branch}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}