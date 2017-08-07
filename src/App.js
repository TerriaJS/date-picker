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
    return <div className='grid-grid'>
              <div className='year-label'>{this.state.year}</div>

              {monthNames.map((m, i)=><div className='grid-row' key={m} onClick={()=>this.setState({month: i})}>
             <span className='grid-label'>{m}</span>
             <span className='grid-row-inner'>{daysInMonth(i+ 1, year).map(d=><span className={ data[year][i] && data[year][i][d+1] ? `is-active ${d}` : d} key={d} ></span>)}</span></div>)}
           </div>
  }


  renderDayView(){
    const days = Object.keys(this.props.data[this.state.year][this.state.month]);
    const daysTodisplay = days.map(d=>moment().date(d).month(this.state.month).year(this.state.year));
    const selected = this.state.day ? moment().date(this.state.day).month(this.state.month).year(this.state.year) : null;
    return <DatePicker
                inline
                onChange={(value)=>this.setState({day: value.date()})}
                includeDates={daysTodisplay}
                selected={selected}
            />
  }


  utsTimeDisplay(m){
    const hour = m.getUTCHours() < 10 ? `0 ${m.getUTCHours()}` : m.getUTCHours();
    const minute = m.getUTCMinutes() < 10 ? `0 ${m.getUTCMinutes()}` : m.getUTCMinutes();
    const second = m.getUTCSeconds() < 10 ? `0 ${m.getUTCSeconds()}` : m.getUTCSeconds();
    return `${hour} : ${minute} : ${second}`
  }

  renderHourView(){
    const timeOptions = this.props.data[this.state.year][this.state.month][this.state.day].map((m)=>({
      value: m.toISOString(),
      label: this.utsTimeDisplay(m)
    }))

    return <div className='hour-view'><select onChange={(event)=>this.setState({hour: event.target.value})}><option value=''>Select a time</option> {timeOptions.map(t=> <option key={t.label} value={t.value}>{t.label}</option>)}</select></div>
  }

  goBack(){
    if(this.state.hour){
      this.setState({
        hour: null
      })
    } else if(this.state.day){
      this.setState({
        day: null
      })
    }
    else if(this.state.month){
      this.setState({
        month: null
      })
    }
    else if(this.state.year){
      this.setState({
        year: null
      })
    }
  }


  render() {
    return (
      <div className="date-picker">
      <div><button className='back' type='button' onClick={()=>this.goBack()}>Back</button></div>
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
