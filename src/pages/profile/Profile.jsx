
import '../../css/profile/profile.css'
import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import DotLoader from "react-spinners/DotLoader"
import axios from 'axios';
import { API_URL } from '../../Constants';
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from '../../Firebase';

import { UserLoggedInContext } from '../../contexts/Contexts';

export default function Profile(){
    const {currentWebUser, setCurrentWebUser, currentWebUserUID, setCurrentWebUserUID} = useContext(UserLoggedInContext)

    const navigate = useNavigate()

    const inputRef = useRef(null);
    // console.log(currentWebUserUID);
    

    const { uid } = useParams();
    const [webUser, setWebUser] = useState({});

    const user = firebaseAuth.currentUser

    useEffect(() => {
  let uid = currentWebUserUID;

  // Fallback to localStorage if context is empty
  if (!uid) {
    const storedUID = localStorage.getItem('userUID');
    if (storedUID) {
      uid = storedUID;
      setCurrentWebUserUID(storedUID); // sync it back into context
    }
  }

  if (uid) {
    axios
      .get(`${API_URL}/getwebuser/${uid}`)
      .then((response) => {
        console.log(response.data);
        setWebUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [currentWebUserUID]);


    // const [showLoader, setShowLoader] = useState(false)

    // async function myDisplay(webUser) {
    //     let myPromise = new Promise(function(resolve) {
    //       setTimeout(function() {resolve(navigate(`/profile/edit/${webUser._id}`, {state:{webUser}}),setShowLoader(false));}, 1500);
    //     });

    // }

    const handleEditProfile = () => {
        navigate(`/profile/edit/${webUser._id}`, {state:{webUser}})
    }

    return(

        <>  
            <div className="main-cont-prof-settings">

                <div className='header-container-prof-settings'>
                    <h1 className='header-text-prof-settings'>Profile Settings</h1>
                </div>        

                <div className='content-container-prof-settings' >
                    <div className='avatar-edit-container-prof-settings'>

                        
                        <div className="avatar-container-prof-settings">

                            <img className="avatar-dimensions" src={webUser.useravatar} alt="" />

                            <h1 className="username-properties">{webUser.firstName} {webUser.lastName}</h1>
                        </div>

                        {/* <div className='edit-btn-container-prof-settings'>
                            <button class="edit-btn-properties" onClick={handleEditProfile}>Edit Profile</button>
                        </div> */}
                    </div>
                    
                    <div className="forms-container">

                        <div className="forms-properties">
                            <label className="forms-label-properties">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input input-properties-disabled"
                                value={webUser.firstName}
                                disabled
                                />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input input-properties-disabled"
                                value={webUser.lastName}
                                disabled
                                />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">NU Branch</label>
                            <select
                                className="input input-bordered input-disabled input-properties-disabled"
                                value={webUser.branch}
                                disabled
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
                        </div>


                        <div className="forms-properties">
                            <label className="forms-label-properties">Email</label>
                            <input
                            type="email"
                            placeholder="Email"
                            className="input input-properties-disabled"
                            value={webUser.email}
                            disabled
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Employee No.</label>
                            <input
                            type="text"
                            placeholder="Employee No."
                            className="input input-properties-disabled"
                            value={webUser.employeenum}
                            disabled
                            />
                        </div>

                        

                        <div className="forms-properties">
                            <label className="forms-label-properties">Position</label>
                            
                            <input
                            type="text"
                            placeholder="Position"
                            className="input input-properties-disabled"
                            value={webUser.position}
                            disabled
                            />
                        </div>
                    </div>

                    <div className='edit-btn-container-prof-settings'>
                        <button class="edit-btn-properties" onClick={handleEditProfile}>Edit Profile</button>
                    </div>
                </div>      
            </div>
        </>
    )
}