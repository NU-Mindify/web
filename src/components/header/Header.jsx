import ExportDropdown from "../ExportDropdown/ExportDropdown";

export default function Header({ title, exportToCSV, exportToPDF }) {
  return (
    <div className="w-full h-[100px] flex justify-between px-5 items-center">
      <h1
        className="text-4xl font-bold !text-[#FFC916] h-[50px] mt-3"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {title}
      </h1>

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
  );
}
