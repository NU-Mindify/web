
import '../../css/profile/profile.css'
import { use, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import DotLoader from "react-spinners/DotLoader"

export default function Profile(props){

    console.log(props);
    // const { uFname, uLName, uEmail, uEmpnum, uNUBranch, uPosition } = props.userInfo

    const navigate = useNavigate()

    const inputRef = useRef(null);

    const [getUserAvatar, setUserAvatar] = useState("")
    const [getFirstName, setFirstName] = useState("Suosuo")
    const [getLastName, setLastName] = useState("Frieren")
    const [getUserEmail, setUserEmail] = useState("virgojl@students.nu-moa.edu.ph")
    const [getEmployeeNum, setEmployeeNo] = useState(100)
    const [getNUBranch, setNUBranch] = useState("moa")
    const [getUserPosition, setUserPosition] = useState("Accounts Admin")

    const [showLoader, setShowLoader] = useState(false)

    async function myDisplay() {
        let myPromise = new Promise(function(resolve) {
          setTimeout(function() {resolve(setIsEditing(true),setShowLoader(false));}, 1500);
        });

    }

    //npm install --save react-spinners

    const handleEditProfile = () => {
        setShowLoader(true)
        myDisplay()
        
    }

    const handleImageClick = () => { 
        inputRef.current.click();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setUserAvatar(event.target.files[0]);
    }

    const [isEditing, setIsEditing] = useState(false);

    const changeFname = (text) => {
        setFirstName(text);
    }

    const changeLname = (text) => {
        setLastName(text);
    }

    const changeUserEmail = (text) => {
        setUserEmail(text);
    }

    const changeEmployeeNum = (text) => {
        setEmployeeNo(text);
    }

    const changeNUBranch = (text) => {
        setNUBranch(text);
    }

    const changeUserPosition = (text) => {
        setUserPosition(text);
    }

    const handleUpdateProfile = () => {
        setIsEditing(false)
    }

    return(

        <>  
            <div className="main-cont-prof-settings">

                <div className='header-container-prof-settings'>
                    {/* <h1 className='header-text-prof-settings'>Profile Settings</h1> */}
                    {isEditing ? (
                        <h1 className='header-text-prof-settings'>Edit Profile</h1>
                    ) : (
                        <h1 className='header-text-prof-settings'>Profile Settings</h1>
                    )}
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
                            
                            {isEditing ? (
                                <h1 className="username-properties" style={{display: "none"}}>{getFirstName} {getLastName}</h1>
                            ) : (
                                <h1 className="username-properties">{getFirstName} {getLastName}</h1>
                            )}
                            
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
                            
                            
                            {isEditing ? (
                                <>
                                    <button class="edit-btn-properties" onClick={handleImageClick}>Upload Photo</button>
                                </>
                            ) : (
                                <button class="edit-btn-properties" onClick={handleEditProfile}>Edit Profile</button>
                            )}
                        </div>
                    </div>
                    
                    <div className="forms-container">

                        <div className="forms-properties">
                            <label className="forms-label-properties">First Name</label>
                            {isEditing ? (
                                <input
                                type="text"
                                placeholder="First Name"
                                className="input input-properties"
                                value={getFirstName}
                                disabled={!isEditing}
                                onChange={(e) => {changeFname(e.target.value)}}
                                />
                            ) : (
                                <input
                                type="text"
                                placeholder="First Name"
                                className="input input-properties-disabled"
                                value={getFirstName}
                                disabled={!isEditing}
                                onChange={(e) => {changeFname(e.target.value)}}
                                />
                            )}
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Last Name</label>
                            {isEditing ? (
                                <input
                                type="text"
                                placeholder="Last Name"
                                className="input input-properties"
                                value={getLastName}
                                disabled={!isEditing}
                                onChange={(e) => {changeLname(e.target.value)}}
                                />
                            ) : (
                                <input
                                type="text"
                                placeholder="Last Name"
                                className="input input-properties-disabled"
                                value={getLastName}
                                disabled={!isEditing}
                                onChange={(e) => {changeLname(e.target.value)}}
                                />
                            )}
                        </div>



                        <div className="forms-properties">
                            <label className="forms-label-properties">NU Branch</label>
                            {isEditing ? (
                                <select
                                className="input input-bordered input-disabled input-properties"
                                value={getNUBranch}
                                disabled={!isEditing}
                                onChange={(e) => {changeNUBranch(e.target.value)}}
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
                            ) : (
                                <select
                                className="input input-bordered input-disabled input-properties-disabled"
                                value={getNUBranch}
                                disabled={!isEditing}
                                onChange={(e) => {changeNUBranch(e.target.value)}}
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
                            )}
                        </div>


                        <div className="forms-properties">
                            <label className="forms-label-properties">Email</label>
                            <input
                            type="email"
                            placeholder="Email"
                            className="input input-properties-disabled"
                            value={getUserEmail}
                            disabled
                            onChange={(e) => {changeUserEmail(e.target.value)}}
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Employee No.</label>
                            <input
                            type="text"
                            placeholder="Employee No."
                            className="input input-properties-disabled"
                            value={getEmployeeNum}
                            disabled
                            onChange={(e) => {changeEmployeeNum(e.target.value)}}
                            />
                        </div>

                        

                        <div className="forms-properties">
                            <label className="forms-label-properties">Position</label>
                            
                            <input
                            type="text"
                            placeholder="Position"
                            className="input input-properties-disabled"
                            value={getUserPosition}
                            disabled
                            onChange={(e) => {changeUserPosition(e.target.value)}}
                            />
                        </div>
                    </div>

                    <div className='save-btn-container-profile-settings' style={isEditing ? {display:'block'} : {display:'none'}}>
                        <button className='save-btn-properties-profile-settings' onClick={handleUpdateProfile}>Save Profile</button>
                        <button className='cancel-btn-properties-profile-settings'>Cancel</button>
                    </div>


                </div>      
            </div>
        </>
    )
}