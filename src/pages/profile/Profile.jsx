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
            <div class="main-cont-prof-settings">
                <div class="header-cont-prof-settings">
                    <h1 class="header-text-prof-settings">Profile Settings</h1>
                </div>

                <div class="content-cont">
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
                        <h1 class="user-name-prof-settings">Mary Ruth Cabales</h1>
                    </div>

                    <div class="forms-cont-prof-settings">

                        <div class="first-three-forms-cont">
                            
                            <div class="fname-div">
                                <label for="fname" class='form-label'>First Name</label>
                                <input class="forms-design"
                                    type='text'
                                    value={"Suosuo"}
                                    id="'fname'"
                                />
                            </div> 

                            <div class="lname-div">
                                <label class='form-label'>Last Name</label>
                                <input class="forms-design"
                                    type='text'
                                    value={"Frieren"}
                                />
                            </div> 

                            <div class="email-div">
                                <label class='form-label'>Email</label>
                                <input class="forms-design"
                                    type='text'
                                    value={"virgojl@students.nu-moa.edu.ph"}
                                />
                            </div> 
                        </div>

                        <div class="second-three-forms-cont">

                            <div>

                            </div> 

                            <div>
                                
                            </div> 
                            
                            <div>
                                
                            </div> 

                        </div>
                    </div>

                </div>


                

                
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
            </div>
        </>
    )
}