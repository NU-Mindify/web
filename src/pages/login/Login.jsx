import '../../css/login/login.css'
import logo from '../../assets/logo/logo.svg'
import nuLogo from '../../assets/logo/nuLogo.svg'
import { useNavigate } from 'react-router-dom'
import { ActiveContext } from '../../contexts/Contexts'
import { useContext, useState } from 'react'


export default function Login(){
    const { isActive, setActive, selected, setSelected, currentUserEmail, setCurrentUserEmail, setCurrentUserBranch } = useContext(ActiveContext)

    const navigate = useNavigate()

    const emailValidation =[
        {branch: 'moa', extension: 'nu-moa.edu.ph'},
        {branch: 'manila', extension: 'nu-manila.edu.ph'},
        {branch: 'fairview', extension: 'nu-fairview.edu.ph'},
        {branch: 'east-ortigas', extension: 'nu-east-ortigas.edu.ph'},
        {branch: 'las-pinas', extension: 'nu-las-pinas.edu.ph'},
        {branch: 'baliwag', extension: 'nu-baliwag.edu.ph'},
        {branch: 'clark', extension: 'nu-clark.edu.ph'},
        {branch: 'laguna', extension: 'nu-laguna.edu.ph'},
        {branch: 'dasmarinas', extension: 'nu-dasmarinas.edu.ph'},
        {branch: 'lipa', extension: 'nu-lipa.edu.ph'},
        {branch: 'bacolod', extension: 'nu-bacolod.edu.ph'},
        {branch: 'cebu', extension: 'nu-cebu.edu.ph'},
    ]
    
    const [email, setEmail] = useState('');
    const [branch, setBranch] = useState('')
     

    function handleLogin() {
        const matchedBranch = emailValidation.find((item) => item.branch === branch);
    
        if (!email.endsWith(`@${matchedBranch.extension}`)) {
            console.log('nde match email at branch');
            return;
        }
    
        console.log("Login successful with:", email);
        setCurrentUserBranch(branch)
        setCurrentUserEmail(email)
        navigate('/dashboard');
        setSelected('dashboard');
    }
    

    

    return(

        <> 
           
            <div className='login-main-container'>
                <div className='logo-container'>
                    <img src={logo} className='logo'></img>
                    <h1 className='info'>
                    A gamified reviewer designed to help aspiring psychometricians at NU MOA prepare for their 
                    licensure examination through interactive and engaging 
                    learning experiences. {branch}{email}
                    </h1>
                </div>
                <div className='login-form'>
                    <div className='nuLogo-container'>
                        <img src={nuLogo} className='nuLogo'></img>
                    </div>

                    <div className='input-container'>
                        <h1 className='welcome-txt'>WELCOME!</h1>
                        <h3 className='mini-txt'>Login to access your account</h3>


                        <label className="floating-label">
                            <span className='spanner'>Campus</span>
                            <select 
                                defaultValue="default" 
                                className="select select-ghost inputs" 
                                onChange={(e) => setBranch(e.target.value)}
                            >
                                <option disabled={true} value='default'>Select a Campus</option>
                                <option value='moa'>NU MOA</option>
                                <option value='manila'>NU MANILA</option>
                                <option value='baliwag'>NU BALIWAG</option>
                            </select>
                        </label>
                        
                        <label className="floating-label">
                            <span className='spanner'>Email</span>
                            <input 
                                className="input validator inputs" 
                                type="email" 
                                required 
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />  
                        </label>

                        <label className="floating-label ">
                            <span className='spanner'>Password</span>
                            <input type="password" className="input validator inputs" required placeholder="Password" minLength="8" 
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" 
                            />   
                        </label>

                        <div className='remember-container'>
                            <input type="checkbox" className="checkbox" title="Required" />
                            <p className='remember-txt'>Remember me</p>
                        </div>

                        <button 
                            className="login-btn" 
                            onClick={handleLogin}
                        >
                            Log In
                        </button>

                        <div className="flex items-center w-full mt-5">
                            <div className="flex-grow h-px bg-black"></div>
                            <span className="px-4 text-black text-xs">or log in with</span>
                            <div className="flex-grow h-px bg-black"></div>
                        </div>

                        <button className="login-btn">
                            <svg aria-label="Microsoft logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 96H247V247H96" fill="#f24f23"></path><path d="M265 96V247H416V96" fill="#7eba03"></path><path d="M96 265H247V416H96" fill="#3ca4ef"></path><path d="M265 265H416V416H265" fill="#f9ba00"></path></svg>
                            Login with Microsoft
                        </button>

                    </div> 
                    

                </div>
            </div>

            <div className='logo-animated'>
                <img src={logo} className='mindifylogo'></img>
            </div>
        </>
    )
}