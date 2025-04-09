import { Link } from 'react-router-dom'
import '../../index.css'

export default function MenuBtn({ icons, active, text, isSelected, onPress, goTo }) {
    return (
        <Link to={goTo} onClick={onPress}>
            <div className={`${active ? 'active-btn-container' : 'btn-container'} ${isSelected ? 'selected' : ''}`}>
                <button
                className={`${active ? 'active-btn-icon' : 'btn-icon'} ${!active ? 'tooltip tooltip-right' : ''}`}
                data-tip={text}
                >
                <img src={icons} className={active ? 'active-mainIcon' : 'mainIcon'} alt={text} />
                {active && <h1 className='active-btn-txt'>{text}</h1>}
                </button>
            </div>
        </Link>
    )
}
