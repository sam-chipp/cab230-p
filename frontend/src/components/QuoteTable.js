import React, { useState, useEffect } from 'react';
import '../App.css';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useCompanyData } from "./Api";
import SearchBar from "./SearchBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LineGraph from "./_lineGraph";
import { Alert } from 'reactstrap';


function CompanyDetails(props){
    return (
      <div className='company'>
        <h1>
          {props.name}
        </h1>
      </div>
    )
}

function QuoteTable(props) {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const onDismissAlert = () => setVisibleAlert(false);
  const [search, setSearch] = useState("A");
  const initialState = {
    startDate: new Date("2019-11-06"),
    endDate: new Date("2020-03-24")

  };
  const [startDate, setStartDate] = useState( initialState.startDate);
  const [endDate, setEndDate] = useState(initialState.endDate);
  const {rowData, error} = useCompanyData(search, startDate, endDate, props.isAuthenticated);
  
  const table = {
    columns: [
        { headerName: 'Date', 
          field: 'timestamp',
          cellRenderer : (data) => {
            return data.value.substring(0, 10);
          }    
        },
        { headerName: 'Code', field: 'symbol'},
        { headerName: 'Open', field: 'open'},
        { headerName: 'High', field: 'high'},
        { headerName: 'Low', field: 'low'},
        { headerName: 'Close', field: 'close'},
        { headerName: 'Volumes', field: 'volumes'}
    ],
    columnDefs:{
        width: 125,
        resizable: true 
    },
  }

  const handleStartChange = (event) => {
    if(event > endDate){
      setVisibleAlert(true);
    } else {
      setStartDate(event);
      setVisibleAlert(false);
    }
  }
  const handleEndChange = (event) => {
    if(event < startDate){
      setVisibleAlert(true);
    } else {
      setEndDate(event);
      setVisibleAlert(false);
    }
  }

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
    <div>
      { props.isAuthenticated ?
          <div className="container"> 
            <div className="quote-table"> 
              <div>
                <h1>Search Stock Prices</h1>
              </div>
              <div className="search-bar">
                <SearchBar onSubmit={handleSubmit} searchText={"Search Symbol"} />
              </div>
              <div>
                <Alert color="info" isOpen={visibleAlert} toggle={onDismissAlert}>
                      Invalid Search
                </Alert>
              </div>
              <div className="date-picker">
                  <DatePicker
                  selected={startDate}
                  onChange={ handleStartChange }
                  selectsStart
                  minDate={initialState.startDate}
                  maxDate={initialState.endDate}
                  showDisabledMonthNavigation
                />
              
                  <DatePicker
                  selected={endDate}
                  onChange={ handleEndChange }
                  selectsEnd
                  minDate={initialState.startDate}
                  maxDate={initialState.endDate}
                  showDisabledMonthNavigation
                />
              </div>
              <div>
                { rowData[0] ? <CompanyDetails name={rowData[0].name}/> : null}
              </div>
              <div 
                className="ag-theme-alpine"
                style ={{
                  height: '300px',
                  width: '850px'
                }}
              >
                <AgGridReact
                  columnDefs={table.columns}
                  rowData={rowData}
                  defaultColDef={table.columnDefs}  
                  pagination={true}
                  paginationPageSize={5}   
                />    
              </div> 
              </div>
              <div>
                { rowData[0] ? <LineGraph  rowData={rowData} /> : null}
              </div>

            </div>  
        :
        <div className="quote-table">  
          <div>
            <h1>Search Stock Prices</h1>
          </div>
          <div className="search-bar">
            <SearchBar onSubmit={handleSubmit} searchText={"Search Symbol"} />
          </div>
          <div>
            <Alert color="info" isOpen={visibleAlert} toggle={onDismissAlert}>
                  Invalid Search
            </Alert>
          </div>
          <div  className="company-details">
            { rowData[0] ? <CompanyDetails name={rowData[0].name} /> : null} 
          </div>
          <div 
          className="ag-theme-alpine"
            style ={{
              height: '300px',
              width: '850px'
          }}
          >
            <AgGridReact
              columnDefs={table.columns}
              rowData={rowData}
              defaultColDef={table.columnDefs}  
              pagination={true}
              paginationPageSize={5}   
            />    
        </div> 
      </div>
      }
    </div>
  );  
}

export default QuoteTable;