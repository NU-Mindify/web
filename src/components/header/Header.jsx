import { useContext, useState } from "react";
import ExportDropdown from "../ExportDropdown/ExportDropdown";
import SelectFilter from "../selectFilter/SelectFilter";
import { ActiveContext, UserLoggedInContext } from "../../contexts/Contexts";


export default function Header({
  id,
  title,
  exportToCSV,
  exportToPDF,
  firstSelectValue,
  firstSelectOnChange,
  firstSelectDisabledOption,
  firstSelectFixOption,
  firstSelectMainOptions,
  firstSelectGetOptionValue,
  firstSelectGetOptionLabel,
  firstSelectAddedClassName,

  secondSelectValue,
  secondSelectOnChange,
  secondSelectDisabledOption,
  secondSelectFixOption,
  secondSelectMainOptions,
  secondSelectGetOptionValue,
  secondSelectGetOptionLabel,
  secondSelectAddedClassName,
}) {

  const {theme, setTheme, textColor} = useContext(ActiveContext)
  const {activeTheme, setActiveTheme} = useState(false)


  return (
    <div 
      className="w-full h-[100px] flex justify-between pl-5 pr-10 items-center rounded-xl"
      style={{ backgroundColor: theme }}
    >
      
      <h1
        className="text-4xl font-bold h-[50px] mt-3"
        style={{ fontFamily: "'Poppins', sans-serif", color: textColor}}
      >
        {title}
      </h1>

      {id === "analytics" && (
        <div className="gap-4 px-4 flex">
          <SelectFilter
            value={firstSelectValue}
            onChange={firstSelectOnChange}
            disabledOption={firstSelectDisabledOption}
            fixOption={firstSelectFixOption}
            mainOptions={firstSelectMainOptions}
            getOptionValue={firstSelectGetOptionValue}
            getOptionLabel={firstSelectGetOptionLabel}
            addedClassName={firstSelectAddedClassName}
          />
          <SelectFilter
            value={secondSelectValue}
            onChange={secondSelectOnChange}
            disabledOption={secondSelectDisabledOption}
            fixOption={secondSelectFixOption}
            mainOptions={secondSelectMainOptions}
            getOptionValue={secondSelectGetOptionValue}
            getOptionLabel={secondSelectGetOptionLabel}
            addedClassName={secondSelectAddedClassName}
          />

          <ExportDropdown
            onExport={(format) => {
              if (format === "csv") {
                exportToCSV();
              } else if (format === "pdf") {
                exportToPDF();
              }
            }}
          />
        </div>
      )}


      {id !== "analytics" && id !== "profile" && (
        <ExportDropdown
          onExport={(format) => {
            if (format === "csv") {
              exportToCSV();
            } else if (format === "pdf") {
              exportToPDF();
            }
          }}
        />
      )}

    </div>
  );
}
