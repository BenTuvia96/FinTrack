import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import "./dashboard.css"; // Import the CSS
import { Link } from "react-router-dom";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Dashboard extends Component {
  render() {
    const data = [
      { name: "Unsatisfied", y: 5 },
      { name: "Very Unsatisfied", y: 31 },
      { name: "Very Satisfied", y: 40 },
      { name: "Satisfied", y: 17 },
      { name: "Neutral", y: 7 },
    ];

    const options = {
      animationEnabled: false,
      title: {
        text: "Expenses",
        fontFamily: "tahoma",
      },
      subtitles: [
        {
          text: "*balance*",
          verticalAlign: "center",
          fontSize: 24,
          dockInsidePlotArea: true,
          fontFamily: "tahoma",
        },
      ],
      data: [
        {
          type: "doughnut",
          showInLegend: true,
          indexLabel: "{name}: {y}",
          yValueFormatString: "#,###'%'",
          dataPoints: data,
        },
      ],
      backgroundColor: "transparent",
    };
    return (
      <div className="dashboard_container">
        <Link to="/">
          <img src="/white_logo.svg" alt="App Logo" className="app_logo" />
        </Link>
        <h1>Dashboard</h1>
        <div className="chart_container">
          <CanvasJSChart className="chart" options={options} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
