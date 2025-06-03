import "./selectfilter.css";

export default function SelectFilter({ 
  value, 
  onChange, 
  fixOption, 
  mainOptions = [], 
  getOptionValue = (opt) => opt, 
  getOptionLabel = (opt) => opt, 
  className = "select-properties",
  addedClassName = "",
  disabledOption
}) {
  return (
    <select value={value} onChange={onChange} className={`${className} ${addedClassName}`}>
      {disabledOption && (
        <option value="" disabled hidden>{disabledOption}</option>
      )}
      {fixOption && (
        <option value="all">{fixOption}</option>
      )}
      {mainOptions.map((option, index) => (
        <option key={index} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
}
