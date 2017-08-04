import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from "d3";


function daysInMonth(month,year) {


const n = new Date(year, month, 0).getDate();
return Array.apply(null, {length: n}).map(Number.call, Number)
}

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
    if(!this.state.year && !this.state.month){
      this.renderYearView(g, self);
    } else{
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
    const yeargroup = g.selectAll('.year').data(years).enter().append('g').attr('class', (d)=>d).attr("transform", (d, i)=>"translate(" + 40 + "," + i * 40 + ")");
    yeargroup.append('text').text(d=>d).attr("transform","translate(-35, 15)");
    yeargroup.selectAll('.bar').data((d, i)=>monthOfYear.map(m=>({year: d, month: m}))).enter().append('rect').attr('width', 5).attr('height', 20).attr('x', d=> d.month* 10 + 10).attr('fill', d=>data[d.year][d.month] ? '#2980b9' : '#ecf0f1').style("cursor", "pointer").on('click', d=>{
      if(data[d.year][d.month]){
        self.setState({
          year: d.year,
          month: d.month
        })
      }
    });
  }


  renderMonthView(g, self){
    const year = self.state.year;
    const month = this.state.month;

    const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    const data = self.props.data;

    const monthgroup = g.selectAll('.year').data(months).enter().append('g').attr('class', (d)=>d).attr("transform", (d, i)=>"translate(" + 40 + "," + i * 40 + ")");
    monthgroup.append('text').text(d=>d).attr("transform","translate(-35, 15)");

    monthgroup.selectAll('.bar').data((m, i)=>daysInMonth(month+ 1, year).map(d=>({month: m, day: d}))).enter().append('rect').attr('width', 5).attr('height', 20).attr('x', d=> d.day* 10 + 10).attr('fill', d=>data[self.state.year][d.month] && data[self.state.year][d.month][d.day] ? '#2980b9' : '#ecf0f1').style("cursor", "pointer").on('click', d=>{
      if(data[self.state.year][d.month] && data[d.month][d.day]){
        self.setState({
          month: d.month,
          day: d.day
        })
      }
    });
  }


  render() {
    console.log(this.state);
    return (
      <div className="App">
        <svg className='year' width= '100%' height='500px' ref={_=>this.yearDiv = _}></svg>
        <div>selected year: {this.state.year}</div>
        <div>selected month: {this.state.month}</div>
      </div>
    );
  }
}

export default App;
