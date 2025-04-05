import edit_icon from '../../assets/edit.svg'
import './profile.css'
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
        //wala pa pang validate kung jpeg/png yung inupload hehi
        
        //npm install validate-image-type (possible solution)
        // import { validateMIMEType } from "validate-image-type";
        // const result = await validateMIMEType("./image.png", {
        //     allowMimeTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml']
        // });
        // if (!result.ok) {
        //     console.error(result.error);
        //     return;
        // }
        // console.log("This image is supported!");

        //notif component for displaying errors
        // https://www.npmjs.com/package/react-notifications-component
    }

    const [display, setDisplay] = useState("notdisplayed");

    const showUploadImg = (e) => {
        e.preventDefault();
        setDisplay("displayed");
    }

    const hideUploadImg = (e) => {
        e.preventDefault();
        setDisplay("notdisplayed");
    }

    const [editing, isEditing] = useState("notediting");

    return(

        <>  
            <div class="main-cont-prof-settings">
                <div class="header-cont-prof-settings">
                    <h1 class="header-text-prof-settings">Profile Settings</h1>
                </div>


                <div class="prof-pic-cont" onMouseEnter={(e) => showUploadImg(e)} onMouseLeave={(e) => hideUploadImg(e)}>
                    <div class="prof-pic">
                        {image ? <img class="prof-pic" src={URL.createObjectURL(image)} alt=""/> : <img class="prof-pic" src="https://avatarfiles.alphacoders.com/375/375159.jpeg" alt="" />}
                    </div>
                    <input 
                    type='file' 
                    ref={inputRef} 
                    onChange={handleImageChange} 
                    style={{display: "none"}}/>

                    <button className={display} onClick={handleImageClick} >
                        <img class="edit-icon" src={edit_icon}/>
                    </button>
                </div>

                

                <div class="content-cont">

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

                    {/* <div class="forms-cont-prof-settings">

                        <div class="first-forms-cont">

                            <div class="fname-cont">
                                <label class="form-text">First Name</label>
                                <input class='form-fields'
                                    type='text'
                                />
                            </div>

                            <div class="lname-cont">
                                <label class="form-text">Last Name</label>
                                <input class='form-fields'
                                    type='text'
                                />
                            </div>

                            <div class="email-cont">
                                <label class="email-text">Email</label>
                                <input class='form-fields'
                                    type='text'
                                />
                            </div>

                        </div>

                        <div class="second-forms-cont">

                             <div class="empno-cont">
                             <label class="empno-text">Employee No.</label>
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

                             <div class="pos-cont">
                             <label class="pos-text">Position</label>
                                <input class='form-fields'
                                    type='text'
                                />
                             </div>
                        </div>

                    </div> */}

                    {/* <div class="forms-cont-prof-settings">
                        <div class="fname-empno-cont">
                            <label class="form-text">First Name</label>
                            <input class='form-fields'
                                type='text'
                                placeholder='First Name'
                            />

                            <label class="form-text">Employee No.</label>
                            <input class='form-fields'
                                type='text'
                                placeholder='Employee No.'
                            />
                        </div>

                        <div class="lname-nubranch-cont">
                            <label class="form-text">First Name</label>
                            <input class='form-fields'
                                type='text'
                                placeholder='Last Name'
                            />

                            <label class="form-text">NU Branch</label>
                            <select class="form-fields">
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
                        
                        <div class="email-position-cont">
                            <label class="form-text">Email</label>
                            <input class='form-fields'
                                type='text'
                                placeholder='Email'
                            />

                            <label class="form-text">Position</label>
                            <input class='form-fields'
                                type='text'
                                placeholder='Position'
                            />
                        </div>
                    </div> */}
                </div>
            </div>


            {/* <div class="upload-btn-cont">

                <input 
                type='file' 
                ref={inputRef} 
                onChange={handleImageChange} 
                style={{display: "none"}}/>


                <button class="upload-btn" onClick={handleImageClick}>
                    Upload Photo
                </button>


                <label class="upload-btn-bottom-label">At least 256 x 256 px PNG or JPG file</label>
            </div> */}

            {/* <div class="name-cont">
                <h1 class="profile-name">{firstName} {lastName}</h1>
                <button><img class="edit-btn" src={edit} onClick={handleEditButton} /></button>
            </div>

            <div>
                <label>First Name</label>
                <textarea className="border-2"
                    type="text"
                    placeholder='First Name'
                    value={firstName}
                    readOnly={!editing}

                />
            </div>
            
            <div>
                <button className='border-2 cursor-pointer' onClick={handleSaveButton}>Save</button>
            </div> */}

        </>
    )
}