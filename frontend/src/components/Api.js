import {useEffect, useState} from 'react';
import axios from "axios";

export function useStocks (search) {
    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getStocks(search)
        // manipulate response to output required formatting for ag-grid table
        .then(response => 
            response.data.map(stocks =>{
                return {
                name: stocks.name,
                symbol: stocks.symbol,
                industry: stocks.industry
                };
        })) 
        .then(stocks => {
            setRowData(stocks)
            setError(null);
        })
        .catch(error => {
            setError(error);
        });
    
      }, [search]);
      return{
          rowData,
          error
      }
}

function getStocks (search) {
    // call api and return result
    let url = process.env.REACT_APP_API_SYMBOLS;
    // only add additional search info if available
    if( search !== undefined ){
        search = search.replace(" ", "%20");
        url = url + "?industry=" + search;
    }
    return axios.get(url)  
}



export function useCompanyData (search, startDate, endDate, isAuthenticated) {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if(search !== ""){
            getCompanyData(search, startDate, endDate, isAuthenticated)
        .then(response => {
            // handle return based on object or array object
            if(Array.isArray(response.data)){
                setRowData(response.data);
            }
            else setRowData([response.data]);
            setLoading(false);
        })
        .catch((e) =>{
            setError(e);
            setLoading(false);
        });
        }
      }, [search, startDate, endDate]);

      return{
          rowData,
          loading,
          error
      }
}

function getCompanyData (search, startDate, endDate, isAuthenticated) {

    // change to ISO string for api call
    startDate = startDate.toISOString()
    endDate = endDate.toISOString()
    
    let apiCall = null;
    let url = process.env.REACT_APP_API_STOCK;

    //only add search criteria is we have a string to apend. 
    if(search !== undefined){
        search = search.toUpperCase();
        apiCall = url + search;
    }
    // only add headers and additional search info if user is authed
    if(isAuthenticated) {
        url = process.env.REACT_APP_API_AUTHED;
        let authString = "Bearer " + JSON.parse(localStorage.getItem("token"));
        apiCall = url + search;
        return axios.get(apiCall, { 
            params: {
                from: startDate,
                to: endDate
            },
            headers: { Authorization: authString}})
    }

    return axios.get(apiCall)
   
}



