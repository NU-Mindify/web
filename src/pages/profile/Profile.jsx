import edit_icon from '../../assets/edit.svg'
import '../../css/profile.css'
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
                    
                    </div>

                    <div className='forms-container-2'>
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

                    {/* <div className='forms-container-prof-settings'>
                        
                        

                    </div> */}

            {/* <div className='forms-properties'>
                            <label className='forms-label-properties'>First Name</label>
                            <input className='input-properties' 
                                type='text'
                                placeholder='First Name'
                                value={"Suosuo"}
                            />
                        </div>
                                
                        <div className='forms-properties'>
                            <label className='forms-label-properties'>Last Name</label>
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
                                value={"virgojl@students.nu-moa.edu.ph"}
                             />
                        </div> */}

            {/* <div class="header-cont-prof-settings">
                    <h1 class="header-text-prof-settings">Profile Settings</h1>
                </div> */}

            {/* <div class="content-cont">
                    <div class="prof-pic-name-edit-btn-cont">

                        <div class="prof-pic-cont">
                            <div class="prof-pic">
                                {image ? <img class="prof-pic" src={URL.createObjectURL(image)} alt=""/> : <img class="prof-pic" src="https://avatarfiles.alphacoders.com/375/375159.jpeg" alt="" />}
                            </div>
                            <input 
                            type='file' 
                            ref={inputRef} 
                            onChange={handleImageChange} 
                            style={{display: "none"}}
                            accept='image/*'
                            />
                        </div>

                        <div class="edit-btn-cont">
                            <button class="edit-btn-prof-settings">Edit Profile</button>
                        </div>

                    </div>

                    <div class="user-name-cont">
                        <h1 class="user-name-prof-settings">Suosuo Frieren</h1>
                    </div>

                    

                </div> */}


                

                
                {/* <div class="content-cont">

                    <div class="user-name-cont">
                        <h1 class="user-name-prof-settings">Suosuo Frieren</h1>
                        <h2 class="position-prof-settings">Accounts Administrator</h2>
                    </div>

                    <div class="edit-btn-cont-prof-settings">
                        <button class="edit-btn-prof-settings">Edit Profile</button>
                    </div>

                    <div class='forms-cont-prof-settings'>
                    
                        <div class="fname-empno-cont">
                            <div class="fname-cont">
                                <label class="form-text">First Name</label>
                                <input class='form-fields'
                                type='text'
                                />
                            </div>

                            <div class="empno-cont">
                                <label class="form-text">Employee No.</label>
                                <input class='form-fields'
                                type='text'
                                />
                             </div>
                        </div>

                        <div class="lname-nubranch-cont">
                            <div class="lname-cont">
                                    <label class="form-text">Last Name</label>
                                    <input class='form-fields'
                                        type='text'
                                    />
                            </div>

                            <div class="nubranch-cont">
                             <label class="form-text">NU Branch</label>
                                <select class="form-fields">
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
                        </div>

                        <div class="email-position-cont">
                            <div class="email-cont">
                                    <label class="form-text">Email</label>
                                    <input class='form-fields'
                                        type='text'
                                    />
                            </div>

                            <div class="pos-cont">
                             <label class="form-text">Position</label>
                                <input class='form-fields'
                                    type='text'
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
        </>
    )
}