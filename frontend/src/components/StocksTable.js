import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Badge } from "reactstrap";
import { useStocks } from "./Api";
import SearchBar from "./SearchBar";
import Select from 'react-dropdown-select';
import { Alert } from 'reactstrap';

function StocksTable() {
    const [search, setSearch] = useState()
    const {rowData, error} = useStocks(search);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const onDismissAlert = () => setVisibleAlert(false);


    const table = {
        columns: [
            { headerName: 'Name', field: 'name', sortable: true, filter: "agTextColumnFilter" },
            { headerName: 'Symbol', field: 'symbol', sortable: true, filter: true},
            { headerName: 'Industry', field: 'industry', sortable: true, filter: true}
        ]
  
    }

    const industries = [
      {  value:"health care", label: "Health Care" },
      {  value: "industrials", label: "Industrials" },
      {  value: "consumer discretionary", label: "Consumer Discretionary" },
      {  value: "information technology", label: "Information Technology" },
      {  value: "consumer staples", label: "Consumer Staples" },
      {  value: "utilities", label: "Utilities" },
      {  value: "financials", label: "Financials" },
      {  value: "real estate", label: "Real Estate" },
      {  value: "materials", label: "Materials" },
      {  value: "energy", label: "Energy" },
      {  value: "telecommunication services", label: "Telecommunication Services" },  
    ]

    
    const handleOnChange = useCallback(event => {
      const value = event;
      setSearch(value[0].value);
      setVisibleAlert(false);

    });
    const handleSubmit = (event) => {
      setSearch(event);
      setVisibleAlert(false);
    }
    useEffect(() => {
      if(error !== null){
        setVisibleAlert(true);
      }
    }, [error]);

      
      return (
        <div className="all-stocks">
        <h1>All Stocks</h1>
        <p>
          <Badge color="success">{rowData.length}</Badge> Available Stock Information
        </p>
        <div className="search-bar">
            <SearchBar onSubmit={handleSubmit} searchText={"Search Industry"} />
        </div>
        <div>
          <Alert color="info" isOpen={visibleAlert} toggle={onDismissAlert}>
                Invalid Search
          </Alert>
        </div>
        <div className="drop-down">
            <Select options={industries} onChange={handleOnChange} />
        </div>
        <div 
          className="ag-theme-alpine"
          style ={{
            height: '400px',
            width: '640px'
          }}
        >
          <AgGridReact
            id="myGrid"
            columnDefs={table.columns}
            rowData={rowData} 
            pagination={true}
            paginationPageSize={20}
          />    
        </div> 
      </div>  
    );
}

export default StocksTable;