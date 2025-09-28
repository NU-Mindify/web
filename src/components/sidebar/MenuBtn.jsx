import { Link } from 'react-router-dom'
import '../../index.css'
import { ActiveContext } from '../../contexts/Contexts'
import { useContext, useState } from 'react'




export default function MenuBtn({ icons, active, text, isSelected, onPress, goTo }) {
    const { theme, hoverColor, textColor } = useContext(ActiveContext);
    const [isHover, setIsHover]= useState(false)
    return (
        <Link to={goTo} onClick={onPress}>
            <div
                className={`font-[Poppins] ${active ? 'active-btn-container' : 'btn-container'} ${isSelected ? 'selected' : ''} ${!active ? 'tooltip tooltip-right z-100' : ''}`}
                style={{backgroundColor: isHover ? hoverColor : ""}}
                data-tip={!active ? text : undefined} 
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <button className={`${active ? 'active-btn-icon' : 'btn-icon'}`}>
                    <img
                        src={icons}
                        className={`${active ? "active-mainIcon" : "mainIcon"} ${
                            theme === "#202024" || theme === "#1D1F79" ? "invert brightness-0" : ""
                        }`}
                        alt={text}
                    />

                    {active && <h1 className={`active-btn-txt ${theme === "#202024" || theme === "#1D1F79" ? "!text-white" : "text-black"}`}>{text}</h1>}
                </button>
            </div>
        </Link>
    )
}
