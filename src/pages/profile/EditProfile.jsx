import '../../css/profile/profile.css'
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios';

export default function EditProfile(){

    const navigate = useNavigate()
    const { uid } = useParams();
    const location = useLocation();
    const [editWebUser, setEditWebUser] = useState(location.state?.webUser || null);

    useEffect(()=>{
        const fetchWebUserDetails = async () => {
            try{
                const response = await axios.get(`https://nu-mindify-api.vercel.app/api/getwebuser/sK4xMv2ZQK6du5jF9XPCrs`); //to replace with uid from firebase db
                setEditWebUser(response.data)
            }catch (error){
                console.error("Error fetching user details", error);
                alert("Failed to get user details");
            }
        };

        if (uid) fetchWebUserDetails();
    }, [uid]);

    const handleUpdateProfile = async () => {
        try{
            await axios.put(`https://nu-mindify-api.vercel.app/api/updateWebUsers/${editWebUser._id}`, editWebUser);
            alert("Update Successful!");
            navigate('/profile')
        }catch(error){
            console.error(error);
            alert("Update Unsuccessful!");
        }
    }

    const handleCancelEdit = () =>{
        navigate('/profile');
    }

    const inputRef = useRef(null);
    // const [image, setImage] = useState("")

    const handleImageClick = () => { 
        inputRef.current.click();
    }

    const [image, setImage] = useState('')
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setImage(file)
        setEditWebUser({...editWebUser, useravatar: file})
    }

    return(

        <>  
            <div className="main-cont-prof-settings">

                <div className='header-container-prof-settings'>
                    <h1 className='header-text-prof-settings'>Edit Profile</h1>
                </div>        

                <div className='content-container-prof-settings'>

                    <div className='avatar-edit-container-prof-settings'>

                    <div className="avatar-container-prof-settings">
                        <img className="avatar-dimensions" src={editWebUser.useravatar} alt="" />
                        {/* {image ? (
                            <img className="avatar-dimensions" src={editWebUser.useravatar} alt="" />
                        ) : (
                            <img className="avatar-dimensions" src="https://avatarfiles.alphacoders.com/375/375159.jpeg" alt="" />
                        )}
                        <input 
                        type='file' 
                        ref={inputRef} 
                        onChange={handleImageChange} 
                        style={{display: "none"}}
                        accept='image/*'
                        /> */}
                    </div>


                        <div className='edit-btn-container-prof-settings'>
                            {/* <button class="edit-btn-properties" onClick={handleImageClick}>Upload Photo</button> */}
                            <label className="forms-label-properties">Enter Image URL</label>
                            <input
                            type="text"
                            placeholder="Image URL"
                            className="input input-properties"
                            value={editWebUser.useravatar}
                            onChange={(e)=> setEditWebUser({...editWebUser, useravatar: e.target.value})}
                            />
                        </div>
                        
                    </div>
                    
                    
                    <div className="forms-container">

                        <div className="forms-properties">
                            <label className="forms-label-properties">First Name</label>
                            <input
                            type="text"
                            placeholder="First Name"
                            className="input input-properties"
                            value={editWebUser.firstName}
                            onChange={(e)=> setEditWebUser({...editWebUser, firstName: e.target.value})}
                            
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Last Name</label>
                            <input
                            type="text"
                            placeholder="Last Name"
                            className="input input-properties"
                            value={editWebUser.lastName}
                            onChange={(e)=> setEditWebUser({...editWebUser, lastName: e.target.value})}
                            
                            />
                        </div>

                        

                        <div className="forms-properties">
                            <label className="forms-label-properties">NU Branch</label>
                            <select
                            className="input input-bordered cursor-pointer input-properties"
                            value={editWebUser.branch}
                            onChange={(e)=> setEditWebUser({...editWebUser, branch: e.target.value})}
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
                            value={editWebUser.email}
                            disabled
                            
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Employee No.</label>
                            <input
                            type="text"
                            placeholder="Employee No."
                            className="input input-properties-disabled"
                            value={editWebUser.employeenum}
                            disabled
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Position</label>
                            <input
                            type="text"
                            placeholder="Position"
                            className="input input-properties-disabled"
                            value={editWebUser.position}
                            disabled
                            />
                        </div>
                    </div>

                    <div className='edit-btn-container-prof-settings'>
                            <button class="edit-btn-properties" onClick={handleUpdateProfile}>Save Profile</button>
                            <button class="edit-btn-properties" onClick={handleCancelEdit}>Cancel</button>
                    </div>

                </div>      
            </div>
        </>
    )
}