
import '../../css/profile/profile.css'
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import DotLoader from "react-spinners/DotLoader"
import axios from 'axios';

export default function Profile(){

    const navigate = useNavigate()

    const inputRef = useRef(null);

    const { uid } = useParams();
    const [webUser, setWebUser] = useState({});

    const [getUserAvatar, setUserAvatar] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:8080/api/getwebuser/sK4xMv2ZQK6du5jF9XPCrs`)
         .then((response) => {
            console.log(response.data);
            setWebUser(response.data);
         })
         .catch((error) => {
            console.log(error)
         })
    }, [uid]);

    const [showLoader, setShowLoader] = useState(false)

    async function myDisplay(webUser) {
        let myPromise = new Promise(function(resolve) {
          setTimeout(function() {resolve(navigate(`/profile/edit/${webUser._id}`, {state:{webUser}}),setShowLoader(false));}, 1500);
        });

    }

    //npm install --save react-spinners

    const handleEditProfile = () => {
        setShowLoader(true)
        myDisplay(webUser)
        
    }

    const handleImageClick = () => { 
        inputRef.current.click();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setUserAvatar(event.target.files[0]);
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
                            {getUserAvatar ? (
                                <img className="avatar-dimensions" src={URL.createObjectURL(getUserAvatar)} alt="" />
                            ) : (
                                <img className="avatar-dimensions" src="https://avatarfiles.alphacoders.com/375/375159.jpeg" alt="" />
                            )}
                            <input 
                            type='file' 
                            ref={inputRef} 
                            onChange={handleImageChange} 
                            style={{display: "none"}}
                            accept='image/*'
                            />

                            <h1 className="username-properties">{webUser.firstName} {webUser.lastName}</h1>
                        </div>


                        <div className='edit-btn-container-prof-settings'>
                            {showLoader ? (
                                <div id='dotloader-cont' style={{display: "block"}}>
                                    <DotLoader 
                                        loading
                                    />
                                </div>
                            ) : (
                                <div id='dotloader-cont' style={{display: "none"}}>
                                    <DotLoader 
                                        loading
                                    />
                                </div>
                            )}
                            <button class="edit-btn-properties" onClick={handleEditProfile}>Edit Profile</button>
                        </div>
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
                </div>      
            </div>
        </>
    )
}