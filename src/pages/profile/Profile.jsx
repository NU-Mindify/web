
import '../../css/profile/profile.css'
import { useRef, useState } from 'react';

export default function Profile(){

    const inputRef = useRef(null);
    const [image, setImage] = useState("")

    const handleImageClick = () => { 
        inputRef.current.click();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setImage(event.target.files[0]);
    }

    const [editing, isEditing] = useState("notediting");

    return(

        <>  
            <div className="main-cont-prof-settings">

                <div className='header-container-prof-settings'>
                    <h1 className='header-text-prof-settings'>Profile Settings</h1>
                </div>        

                <div className='content-container-prof-settings'>

                    <div className='avatar-edit-container-prof-settings'>

                    <div className="avatar-container-prof-settings">
                        {image ? (
                            <img className="avatar-dimensions" src={URL.createObjectURL(image)} alt="" />
                        ) : (
                            <img className="avatar-dimensions" src="https://avatarfiles.alphacoders.com/375/375159.jpeg" alt="" />
                        )}
                        <h1 className="username-properties">Suosuo Frieren</h1>
                    </div>


                        <div className='edit-btn-container-prof-settings'>
                            <button class="edit-btn-properties" onClick={handleImageClick}>Edit Profile</button>
                        </div>
                    </div>
                    
                    
                    <div className="forms-container">

                        <div className="forms-properties">
                            <label className="forms-label-properties">First Name</label>
                            <input
                            type="text"
                            placeholder="First Name"
                            className="input input-properties"
                            value={"Suosuo"}
                            disabled
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Last Name</label>
                            <input
                            type="text"
                            placeholder="Last Name"
                            className="input input-properties"
                            value={"Frieren"}
                            disabled
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Email</label>
                            <input
                            type="email"
                            placeholder="Email"
                            className="input input-properties"
                            value={"virgojl@students.nu-moa.edu.ph"}
                            disabled
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">Employee No.</label>
                            <input
                            type="text"
                            placeholder="Employee No."
                            className="input input-properties"
                            value={"01"}
                            disabled
                            />
                        </div>

                        <div className="forms-properties">
                            <label className="forms-label-properties">NU Branch</label>
                            <select
                            className="input input-bordered input-disabled cursor-not-allowed input-properties"
                            disabled
                            value={"moa"}
                            >
                            <option value="default">Select a Branch</option>
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
                            <label className="forms-label-properties">Position</label>
                            <input
                            type="text"
                            placeholder="Position"
                            className="input input-properties"
                            value={"Account Admin"}
                            disabled
                            />
                        </div>
                    </div>


                </div>      
            </div>
        </>
    )
}