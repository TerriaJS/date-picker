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

  componentDidMount(){
    this.createChart();
  }


  componentDidUpdate(){
    this.createChart();
  }


  renderYearView(g, self){
    const data = self.props.data;
    const years = Object.keys(data);
    const monthOfYear = Array.apply(null, {length: 12}).map(Number.call, Number);
    const yeargroup = g.selectAll('.year').data(years).enter().append('g').attr('class', (d)=>d).attr("transform", (d, i)=>"translate(" + 40 + "," + i * 40 + ")").style("cursor", "pointer").on('click', d=>{
      if(data[d]){
        self.setState({
          year: d,
        })
      }
    });
    yeargroup.append('text').text(d=>d).attr("transform","translate(-35, 15)");
    yeargroup.selectAll('.bar').data((d, i)=>monthOfYear.map(m=>({year: d, month: m}))).enter().append('rect').attr('width', 5).attr('height', 20).attr('x', d=> d.month* 10 + 10).attr('fill', d=>data[d.year][d.month] ? '#2980b9' : '#ecf0f1');
  }


  renderMonthView(g, self){
    const year = self.state.year;
    const month = this.state.month;


    const data = self.props.data;

    const monthgroup = g.selectAll('.year').data(monthNames).enter().append('g').attr('class', (d)=>d).attr("transform", (d, i)=>"translate(" + 40 + "," + i * 40 + ")").style("cursor", "pointer").on('click', (d, i)=>{
      if(data[self.state.year][i]){
        self.setState({
          month: i,
        })
      }
    });
    monthgroup.append('text').text(d=>d).attr("transform","translate(-35, 15)");

    monthgroup.selectAll('.bar').data((m, i)=>daysInMonth(i+ 1, year).map(d=>({month: i, day: d}))).enter().append('rect').attr('width', 5).attr('height', 20).attr('x', d=> d.day* 10 + 10)
    .attr('fill', d=>data[self.state.year][d.month] && data[self.state.year][d.month][d.day] ? '#2980b9' : '#ecf0f1');
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

    return <div><select onChange={(event)=>this.setState({hour: event.target.value})}>{timeOptions.map(t=> <option key={t.label} value={t.value}>{t.label}</option>)}</select></div>
  }



  render() {
    console.log(this.props.data);
    return (
      <div className="App">
        <svg className='year' width= '100%' height='400px' ref={_=>this.yearDiv = _}></svg>
        {(this.state.year && this.state.month) && this.renderDayView()}
        {(this.state.year && this.state.month && this.state.day) && this.renderHourView()}
        <div>selected year: {this.state.year}</div>
        <div>selected month: {monthNames[this.state.month]}</div>
        <div>selected day: {this.state.day}</div>
        <div>selected time: {this.state.hour}</div>
      </div>
    );
  }
}

export default App;
