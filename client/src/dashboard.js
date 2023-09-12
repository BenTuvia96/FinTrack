import React, { Component } from "react";
import "./dashboard.css";
import TopBar from "./top_bar";
import { DoughnutChart } from "./dashboard_components/doughnut_chart.jsx";
import { BarChart } from "./dashboard_components/bar_chart";
import { AreaChart } from "./dashboard_components/area_chart";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <TopBar header={"Dashboard"}/>

        <div className="dashboard-container">
          <div className="chart-container">
            <DoughnutChart />
          </div>
          <div className="chart-container">
            <BarChart />
          </div>
          <div className="chart-container">
            <AreaChart />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
