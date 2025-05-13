import '../../css/login/login.css'
import logo from '../../assets/logo/logo.svg'
import nuLogo from '../../assets/logo/nuLogo.svg'
import { useNavigate } from 'react-router-dom'
import { ActiveContext } from '../../contexts/Contexts'
import { UserLoggedInContext } from '../../contexts/Contexts'
import { useContext, useState } from 'react'

import { firebaseAuth } from '../../Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { branches } from '../../Constants';

export default function Login(){
    const { setSelected } = useContext(ActiveContext)
    const {setCurrentWebUserUID} = useContext(UserLoggedInContext)

    const navigate = useNavigate()

   
    const [isLoading, setIsLoading] = useState(false);
        
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [branch, setBranch] = useState('');

    const handelLoginFirebase = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const matchedBranch = branches.find((item) => item.id === branch);
        console.log(matchedBranch);
        
        try{

            if (!matchedBranch) {
                console.log('Please select a campus.');
                alert("please select a campus")
                return;
            }

            if(!email){
                alert("Please enter a valid email")
                return;
            }
    
            if(!password){
                alert("Please enter your password")
                return;
            }
    
            if (!email.endsWith(`@${matchedBranch.extension}`)) {
                console.log('nde match email at branch');
                alert("Account: "+email+ " not found at NU "+ branch.toUpperCase())
                return;
            }

            await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = firebaseAuth.currentUser;

            if(user){
                const token = await user.getIdToken(); 
                const fifteenMinutes = 15 * 60;
                document.cookie = `token=${token}; path=/; Max-Age=${fifteenMinutes}; Secure; SameSite=Strict`;

                setCurrentWebUserUID(user.uid)
                localStorage.setItem('userUID', user.uid);

                setIsLoading(false)
                setSelected('dashboard');
                navigate('/dashboard');
            }
        }catch(error){
            console.log(error.message);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="loading-overlay">
                <img src={logo} alt="Mindify Logo" style={{ width: '80px', marginBottom: '20px' }} />
                <div className="spinner"></div>
                <p>Signing you in...</p>
            </div>
        );
    }

    return(

        <> 
           
            <div className='login-main-container'>
                <div className='logo-container'>
                    <img src={logo} className='logo' alt='Logo'></img>
                    <h1 className='info'>
                    A gamified reviewer designed to help aspiring psychometricians at NU MOA prepare for their 
                    licensure examination through interactive and engaging 
                    learning experiences.
                    </h1>
                </div>
                <div className='login-form'>
                    <div className='nuLogo-container'>
                        <img src={nuLogo} className='nuLogo' alt='Logo'></img>
                    </div>

                    <div className='input-container'>
                        <h1 className='welcome-txt'>WELCOME!</h1>
                        <h3 className='mini-txt'>Sign in to access your account</h3>


                        <label className="floating-label">
                            <span className='spanner'>Campus</span>
                            <select 
                                defaultValue="default" 
                                className="select select-ghost inputs" 
                                onChange={(e) => setBranch(e.target.value)}
                            >
                                <option disabled={true} value='default'>Select a Campus</option>
                                    {branches.map(branch => (
                                        <option value={branch.id} key={branch.id}>{branch.name}</option>
                                    ))}
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
                                onChange={(e) => setPassword(e.target.value)}
                            />   
                        </label>

                        <div className='remember-container'>
                            <input type="checkbox" className="checkbox" title="Required" />
                            <p className='remember-txt'>Remember me</p>
                        </div>

                        <button 
                            className="login-btn" 
                            onClick={handelLoginFirebase}
                        >
                            Sign In
                        </button>

                        <div className="flex items-center w-full mt-5">
                            <div className="flex-grow h-px bg-black"></div>
                            <span className="px-4 text-black text-xs">or sign in with</span>
                            <div className="flex-grow h-px bg-black"></div>
                        </div>

                        <button className="login-btn">
                            <svg aria-label="Microsoft logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 96H247V247H96" fill="#f24f23"></path><path d="M265 96V247H416V96" fill="#7eba03"></path><path d="M96 265H247V416H96" fill="#3ca4ef"></path><path d="M265 265H416V416H265" fill="#f9ba00"></path></svg>
                            Sign In with Microsoft
                        </button>

                    </div> 
                    

                </div>
            </div>

            <div className='logo-animated'>
                <img src={logo} className='mindifylogo' alt='"Logo"'></img>
            </div>
        </>
    )
}