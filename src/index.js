import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import {data} from './exampleData';
import moment from 'moment';
import uniq from 'lodash.uniq';

function getOneYear(year, dates){
  // al data from a given year
  return dates.filter(d=>d.year() === year)
}

function getOneMonth(yearData, monthIndex){
  // all data from certain month of that year
  return yearData.filter(y=>y.month() === monthIndex);
}

function getOneDay(monthData, dayIndex){
  return monthData.filter(m=>m.date() === dayIndex)
}

function getMonthForYear(yearData){
  // get available months for a given year
  return uniq(yearData.map(d=>d.month()));
}

function getDaysForMonth(monthData){
  // get all available days given a month in a year
  return uniq(monthData.map(m=>m.date()));
}


function processData(data){
  const dates = data.map(d=>moment(d));
  const years = uniq(dates.map(d=>d.year()));
  const result = {};



  years.map(y=>{
    const yearData = getOneYear(y, dates);
    const monthinyear = {};
      getMonthForYear(yearData).forEach(monthIndex => {
            const monthData = getOneMonth(yearData, monthIndex);
            const daysinmonth = {};
            getDaysForMonth(monthData).forEach(dayIndex => daysinmonth[dayIndex] = getOneDay(monthData, dayIndex));
            monthinyear[monthIndex] = daysinmonth
          });
      result[y] = monthinyear;
      })

  return result;
}


ReactDOM.render(<App data ={processData(data)}/>, document.getElementById('root'));
registerServiceWorker();
