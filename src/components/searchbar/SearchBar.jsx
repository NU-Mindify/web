// SearchBar.jsx
import { useContext } from 'react';
import { ActiveContext } from '../../contexts/Contexts';
import './searchbar.css';


export default function SearchBar({
  placeholder = 'Search...',
  value,
  handleChange,
  icon,
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  addedClassName
}){

  const { divColor, textColor, theme, iconColor} = useContext(ActiveContext)
  return (
    <div className={`search-bar-holder ${addedClassName}`} style={{backgroundColor: divColor}}>
      {icon && (
        <img
          src={icon}
          alt="Search"
          className="search-icon w-4 h-4 mr-2"
          style={{filter: iconColor}}
        />
      )}
      <input
        type="text"
        className={`search-bar-input`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={{color: textColor}}
      />
      {suggestions.length > 0 && showSuggestions && (
        <ul className="search-suggestion-dropdown text-black" style={{backgroundColor: divColor}}>
          {suggestions.map((user) => (
            <li
              key={user.employeenum}
              className="search-suggestion-item"
              onMouseDown={(e) => {
                e.preventDefault();
                onSuggestionSelect?.(user);
              }}
              style={{backgroundColor: divColor, color: textColor, border: theme}}
            >
              {user.lastName.toUpperCase()}, {user.firstName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
