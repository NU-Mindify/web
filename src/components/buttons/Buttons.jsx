import './button.css';

export default function Buttons({text, onClick, addedClassName, disabled}){
    return(
        <div className="all-btn-container">
            <button
                onClick={onClick}
                className={`all-btn-holder ${addedClassName}`}
                disabled={disabled || null}
            >
                {text}
            </button>
        </div>
    )
}