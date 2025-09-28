import { useContext } from "react";
import { ActiveContext } from "../../contexts/Contexts";
import "./selectfilter.css";


export default function SelectFilter({ 
  ariaLabel,
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


  const { theme, divColor, textColor } = useContext(ActiveContext);
  return (
    <select aria-label={ariaLabel} value={value} onChange={onChange} className={`${className} ${addedClassName}`} style={{backgroundColor: divColor, color: textColor}}>
      {disabledOption && (
        <option value="" disabled hidden>{disabledOption}</option>
      )}
      {fixOption && (
        <option value="all" style={{color: textColor}}>{fixOption}</option>
      )}
      {mainOptions.map((option, index) => (
        <option key={index} value={getOptionValue(option)} style={{color: textColor}}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
}
