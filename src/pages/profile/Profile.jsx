
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

                        <div className='avatar-container-prof-settings'>
                            {image ? <img class="avatar-dimensions" src={URL.createObjectURL(image)} alt=""/> : <img class="avatar-dimensions" src="https://avatarfiles.alphacoders.com/375/375159.jpeg" alt="" />}
                            <input 
                            type='file' 
                            ref={inputRef} 
                            onChange={handleImageChange} 
                            style={{display: "none"}}
                            accept='image/*'
                            />
                        </div>

                        <div className='edit-btn-container-prof-settings'>
                            <button class="edit-btn-properties" onClick={handleImageClick}>Edit Profile</button>
                        </div>
                    </div>

                    <div className='username-container-prof-settings'>
                        <h1 className='username-properties'>Suosuo Frieren</h1>
                    </div>

                    
                    <div className='forms-container-1'>

                        <div className='forms-properties'>
                            <label className='forms-label-properties'>First Name</label>
                            <input className='input-properties'
                                type='text'
                                placeholder='First Name'
                                value={"Suosuo"}
                            />
                        </div>

                        <div className='forms-properties'>
                            <label className='forms-label-properties' >Last Name</label>
                            <input className='input-properties'
                                type='text'
                                placeholder='Last Name'
                                value={"Frieren"}
                            />
                        </div>

                        <div className='forms-properties'>
                            <label className='forms-label-properties'>Email</label>
                            <input className='input-properties'
                                type='text'
                                placeholder='Email'
                                value={"virgojl@student-nu-moa.edu.ph"}
                            />
                        </div>

                        <div className='forms-properties'>
                            <label className='forms-label-properties'>Employee No.</label>
                            <input className='input-properties'
                                type='text'
                                placeholder='Employee No.'
                                value={"01"}
                            />
                        </div>

                        <div className='forms-properties'>
                            <label class="forms-label-properties">NU Branch</label>
                                <select class="input-properties">
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

                        <div className='forms-properties'>
                            <label className='forms-label-properties'>Position</label>
                            <input className='input-properties'
                                type='text'
                                placeholder='Position'
                                value={"Accounts Admin"}
                            />
                        </div>
                    </div>
                </div>     
            </div>
        </>
    )
}