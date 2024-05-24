import { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { StyledInput, StyledSelect } from "./styles";
import rowData from "./data.json";

type Row = {
  id: number;
  first_name: string;
  last_name: string;
  ip_address: string;
  balance: number;
};

function App() {
  const [search, setSearch] = useState<string>("");
  const [selectedColID, setSelectedColID] = useState<string>("");

  // filtering should happen from the values in rowData, use the option to filter the desired column based on the user search.
  // colDefs should be dynamic, same work you do to the options can be done to it.
  // to style the input, you can just pass a prop similar

  // Filtering function to filter rowData based on search input and selected column.
  const filterData = (data: Row[], selectedColumn: (typeof columnDefs)[number]["field"]) => {
    return data.filter((row) => {
      //Currently the search is not case sensitive, remove toLowerCase() to make it case sensitive.
      const value = row[selectedColumn].toString().toLowerCase();
      return value.includes(search.toLowerCase());
    });
  };

  // This handler will update selectedColID with the current selected cell's column.
  // Used to detect when IP column is not selected.
  const handleCellClick = (params) => {
    setSelectedColID(params.column.colId);
    console.log("current cell clicked", params.node.id);
  };

  const columnDefs = [
    { field: "id", onCellClicked: handleCellClick },
    { field: "first_name", onCellClicked: handleCellClick },
    { field: "last_name", onCellClicked: handleCellClick},
    {
      field: "ip_address",
      cellRenderer: (params) => {
        // This will render IP's only if the column is selected, otherwise return blanks.
        if (selectedColID === "ip_address") {
          // in here you will check if you want to render the ip address or not. Done!
          return params.value;
        }
        return "";
      },
      onCellClicked: handleCellClick ,
    },
    { field: "balance", valueFormatter: (p) => new Intl.NumberFormat('en-US', { style: 'currency', 
        currency: 'USD', minimumFractionDigits: 2 }).format(p.value), // in here you will finish formatting the balance, Done!
      onCellClicked: handleCellClick },
      ] as const;

  const [selectedOption, setSelectedOption] =
    useState<(typeof columnDefs)[number]["field"]>("id");

  const options = () => {
    const opt: {
      label: string;
      value: string;
    }[] = [];

    // Use a set to keep track of what options are available
    const optSet = new Set<string>();

    rowData.map((row: Row) => {
      return Object.entries(row).map((e) => {
        const [label] = e;

        // filter the options to not have duplicate values. Done!
        // Use the set from above to keep track of what options have been put in and add as encountered.
        if(!optSet.has(label)){
          optSet.add(label);
          opt.push({
            label,
            value: label,
          });
        }
      });
    });

    return opt;
  };

  // filteredData represents a collection the filterData from ear
  const filteredData = filterData(rowData, selectedOption as (typeof columnDefs)[number]["field"]);

  // If filteredData has at least one row then the search was valid.
  const isSearchTermFound = filteredData.length > 0;

  // Use the selectedOption state value to determine what color the selection border should be.
  const getSelectColor = () => {
    switch (selectedOption) {
      case "first_name":
        return "blue";
      case "ip_address":
        return "red";
      case "last_name":
        return "green";
      case "balance":
        return "lightgreen";
      default:
        return "black";
    }
  };

  const defaultColDef = {
    flex: 1,
  };

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: 500,
      }}
    >
      <StyledInput
        $yourProp={isSearchTermFound}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <StyledSelect
        $selectionColor={getSelectColor()}
        options={options()}
        value={selectedOption}
        onChange={(e) =>
          setSelectedOption(e as (typeof columnDefs)[number]["field"])
        }
      />
      <AgGridReact defaultColDef={defaultColDef} rowData={filteredData} columnDefs={columnDefs as any} />
    </div>
  );
}

export default App;
