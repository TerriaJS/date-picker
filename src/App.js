import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from "d3";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';



function daysInMonth(month,year) {
const n = new Date(year, month, 0).getDate();
return Array.apply(null, {length: n}).map(Number.call, Number)
}


const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]

// get all available year
// get all months for each year
// get days of a month
// get all time of a day

class App extends Component {
  constructor(props) {
   super(props);
   this.state = {
     year: null,
     month: null,
     day: '',
     hour: ''};
 }


  createChart(){
    const data = this.props.data;
    const self = this;
    const years = Object.keys(data);
    const container = this.yearDiv;
    d3.select(container).selectAll('*').remove();
    const g = d3.select(container).append('g').attr("transform", "translate(40, 40)");
    if(!this.state.year){
      this.renderYearView(g, self);
    } else if(!this.state.month){
      this.renderMonthView(g, self);
    }
  }


  renderYearGrid(){
    const data = this.props.data;
    const years = Object.keys(data);
    const monthOfYear = Array.apply(null, {length: 12}).map(Number.call, Number);
    return <div className='grid-grid'>{years.map(y=><div className='grid-row' key={y} onClick={()=>this.setState({year: y})}>
             <span className='grid-label'>{y}</span>
             <span className='grid-row-inner'>{monthOfYear.map(m=><span className={data[y][m] ? 'is-active' : ''} key={m} ></span>)}</span></div>)}
           </div>
  }

  renderMonthGrid(){
    const data = this.props.data;
    const year = this.state.year;
    return <div className='grid-grid'>{monthNames.map((m, i)=><div className='grid-row' key={m} onClick={()=>this.setState({month: i})}>
             <span className='grid-label'>{m}</span>
             <span className='grid-row-inner'>{daysInMonth(i+ 1, year).map(d=><span className={ data[year][i] && data[year][i][d] ? 'is-active' : ''} key={d} ></span>)}</span></div>)}
           </div>
  }


  renderDayView(){
    const days = Object.keys(this.props.data[this.state.year][this.state.month]);
    const daysTodisplay = days.map(d=>moment().date(d).month(this.state.month).year(this.state.year));
    return <DatePicker
                inline
                onChange={(value)=>this.setState({day: value.date()})}
                includeDates={daysTodisplay}
            />
  }

  renderHourView(){
    const timeOptions = this.props.data[this.state.year][this.state.month][this.state.day].map((m)=>({
      value: m,
      label: m.format('LTS')
    }))

    return <div className='hour-view'><select onChange={(event)=>this.setState({hour: event.target.value})}>{timeOptions.map(t=> <option key={t.label} value={t.value}>{t.label}</option>)}</select></div>
  }



  render() {
    console.log(this.props.data);
    return (
      <div className="date-picker">
        {!this.state.year && this.renderYearGrid()}
        {this.state.year && !this.state.month && this.renderMonthGrid()}
        {(this.state.year && this.state.month) && this.renderDayView()}
        {(this.state.year && this.state.month && this.state.day) && this.renderHourView()}
        <div className='summray'>
          <div>selected year: {this.state.year}</div>
          <div>selected month: {monthNames[this.state.month]}</div>
          <div>selected day: {this.state.day}</div>
          <div>selected time: {this.state.hour}</div>
        </div>
      </div>
    );
  }
}

export default App;
