/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CircularProgress, Typography } from "@mui/material";
import { useFetchData } from "../../../hooks/use-crud";

interface DataTableProps {
  url: string;
  rowData: any[];
  columnDefs: any[];
  paginationPageSize?: number;
  defaultColDef?: any;
  exportFileName?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  url,
  columnDefs,
  paginationPageSize = 10,
  defaultColDef = { resizable: true, sortable: true, filter: true },
}) => {
  const { data, isLoading, isError, error } = useFetchData(url);

  const rowData = Array.isArray(data) ? data : data?.users || [];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6" color="error">
          {error ? error.message : "Error loading data!"}
        </Typography>
      </div>
    );
  }

  const modifiedColumnDefs = columnDefs.map((colDef: any) => {
    console.log(colDef.cellRenderer);
    if (colDef.cellRenderer) {
      colDef.cellRendererFramework = colDef.cellRenderer;
    }
    return colDef;
  });

  return (
    <div className="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
      <AgGridReact
        columnDefs={modifiedColumnDefs}
        rowData={rowData}
        paginationPageSize={paginationPageSize}
        defaultColDef={defaultColDef}
        pagination={true}
        domLayout="autoHeight"
      />
      {rowData.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Typography variant="body1">No data available</Typography>
        </div>
      )}
    </div>
  );
};

export default DataTable;
