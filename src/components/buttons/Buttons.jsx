import { useContext, useState } from 'react';
import './button.css';
import { ActiveContext } from '../../contexts/Contexts';


export default function Buttons({text, onClick, addedClassName, disabled}){
    const {buttonColor, theme, hoverColor, textColor} = useContext(ActiveContext)
    const [isHover, setIsHover] = useState(false)
    return(
        <div className="all-btn-container">
            <button
                onClick={onClick}
                className={`all-btn-holder ${addedClassName}`}
                disabled={disabled || null}
                style={{backgroundColor: isHover ? hoverColor : buttonColor, color: isHover ? textColor : theme}}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {text}
            </button>
        </div>
    )
}