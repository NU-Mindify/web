// SearchBar.jsx
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
  return (
    <div className={`search-bar-holder ${addedClassName} bg-white`}>
      {icon && (
        <img
          src={icon}
          alt="Search"
          className="search-icon w-4 h-4 mr-2"
        />
      )}
      <input
        type="text"
        className={`search-bar-input`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {suggestions.length > 0 && showSuggestions && (
        <ul className="search-suggestion-dropdown text-black">
          {suggestions.map((user) => (
            <li
              key={user.employeenum}
              className="search-suggestion-item"
              onMouseDown={(e) => {
                e.preventDefault();
                onSuggestionSelect?.(user);
              }}
            >
              {user.lastName.toUpperCase()}, {user.firstName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
