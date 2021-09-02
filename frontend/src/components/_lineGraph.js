import React from 'react';
import {Line} from 'react-chartjs-2';




export default function LineGraph (props) {
    let labels = null;
    let data = null;
  
    if(props){

        // get required data for line chart
        labels = props.rowData.map((data) => { 
            return data.timestamp;
        });
        // use only the first section from a datetime string to display date
        for(let i = 0; i < labels.length; i++){
            
            labels[i] = labels[i].substring(0,10)
        };
        data = props.rowData.map((data) => {
            return data.close;
        });
        // reverse to display from earliest date to most recent
        labels.reverse();
        data.reverse();

    }
    const state = {
        labels: labels,
        datasets: [
          {
            label: 'Prices',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: data
          }
        ]
      }
      
    return (
    // line graph
    <div className="line-graph">
        <Line
        data={state}
        options={{
            title:{
            display:true,
            text:'Price Fluctuations',
            fontSize:20
            },
            legend:{
            display:true,
            position:'right'
            }
        }}
        />
    </div>
    );
}
