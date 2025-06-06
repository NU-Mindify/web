import { Link } from 'react-router-dom'
import '../../index.css'

export default function MenuBtn({ icons, active, text, isSelected, onPress, goTo }) {
    return (
        <Link to={goTo} onClick={onPress}>
            <div
                className={`font-[Poppins] ${active ? 'active-btn-container' : 'btn-container'} ${isSelected ? 'selected' : ''} ${!active ? 'tooltip tooltip-right z-100' : ''}`}
                data-tip={!active ? text : undefined} 
            >
                <button className={`${active ? 'active-btn-icon' : 'btn-icon'}`}>
                    <img src={icons} className={active ? 'active-mainIcon' : 'mainIcon'} alt={text} />
                    {active && <h1 className='active-btn-txt'>{text}</h1>}
                </button>
            </div>
        </Link>
    )
}
