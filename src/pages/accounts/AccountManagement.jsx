import { use, useEffect, useState } from "react"
import '../../css/account//account.css'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { firebaseAuth } from "../../Firebase"
import axios from 'axios';
import { API_URL } from '../../Constants';

export default function AccountManagement(){

    const [email, setEmail] = useState('')
    const [webusers, setWebUsers] = useState([])
    const [newWebUser, setNewWebUser] = useState({firstName: '', lastName: '', branch: '', email: '', employeenum: '', position: '', uid: '', useravatar: ''})
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isSignedIn, setIsSignedIn] = useState(false);

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

    const handleReset = () => {
        setNewWebUser({firstName: '', lastName: '', branch: '', email: '', employeenum: '', position: '', uid: '', useravatar: ''})
        setPassword('')
        setConfirmPassword('')
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(firebaseAuth, newWebUser.email, password);
            const user = firebaseAuth.currentUser;
            console.log(user);
            console.log(user.uid)
            alert("User Registered Successfully")
            
            const uidWebUser = {...newWebUser, uid: user.uid}

            axios.post(`${API_URL}/createWebUser`, uidWebUser)
             .then(() => {
                fetchWebUsers();
                alert(`Account ${newWebUser.email} has been added to the database`);
                // setNewWebUser({firstName: '', lastName: '', branch: '', email: '', employeenum: '', position: '', uid: '', useravatar: ''})
                handleReset();
             })
             .catch((error)=> {
                console.log(error)
             })

        }catch(error){
            console.log(error.message);
        }
    };

    return(
        <>
            <div className="acc-main-container">
            
                <label>First Name:</label>
                <input 
                    type="text"
                    placeholder="First Name"
                    value={newWebUser.firstName}
                    onChange={(e)=>setNewWebUser({...newWebUser, firstName: e.target.value})}
                />

                <label>Last Name:</label>
                <input 
                    type="text"
                    placeholder="Last Name"
                    value={newWebUser.lastName}
                    onChange={(e)=>setNewWebUser({...newWebUser, lastName: e.target.value})}
                />

                <label>Branch:</label>
                <label className="forms-label-properties">NU Branch</label>
                            <select
                                // className="input input-bordered input-disabled input-properties-disabled"
                                onChange={(e)=>setNewWebUser({...newWebUser, branch: e.target.value})}
                                value={newWebUser.branch}
                                >
                                <option value="manila">NU Manila</option>
                                <option value="moa">NU MOA</option>
                                <option value="laguna">NU Laguna</option>
                                <option value="fairview">NU Fairview</option>
                                <option value="baliwag">NU Baliwag</option>
                                <option value="dasma">NU Dasmarinas</option>
                                <option value="lipa">NU Lipa</option>
                                <option value="clark">NU Clark</option>
                                <option value="bacolod">NU Bacolod</option>
                                <option value="eastortigas">NU East Ortigas</option>
                            </select>

                <label>Email:</label>
                <input 
                    type="text"
                    placeholder="Email"
                    value={newWebUser.email}
                    onChange={(e)=>setNewWebUser({...newWebUser, email: e.target.value})}
                />

                <label>Employee No: </label>
                <input 
                    type="text"
                    placeholder="Employee No."
                    value={newWebUser.employeenum}
                    onChange={(e)=>setNewWebUser({...newWebUser, employeenum: e.target.value})}
                />

                <label>Position: </label>
                <input 
                    type="text"
                    placeholder="Position"
                    value={newWebUser.position}
                    onChange={(e)=>setNewWebUser({...newWebUser, position: e.target.value})}
                />

                <label>useravatar: </label>
                <input 
                    type="text"
                    placeholder="Profile Pic URL LINK"
                    value={newWebUser.useravatar}
                    onChange={(e)=>setNewWebUser({...newWebUser, useravatar: e.target.value})}
                />

                <label>Password:</label>
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <label>Confirm Password:</label>
                <input 
                    type="text"
                    placeholder="Confirm Password"
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Submit</button>
                <button onClick={handleReset}>Reset</button>
            </div>
        </>
    )
}