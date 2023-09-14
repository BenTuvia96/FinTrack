import React, { Component } from "react";
import TopBar from "./top_bar";
import { DoughnutChart } from "./dashboard_components/doughnut_chart.jsx";
import { BarChart } from "./dashboard_components/bar_chart";
import { AreaChart } from "./dashboard_components/area_chart";
import "./dashboard.css";

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard_page_container">
        <TopBar header={"Dashboard"} />
        <div className="dashboard-container">
          <div className="doughnut-container">
            <DoughnutChart />
          </div>
          <div className="bar-container">
            <BarChart />
          </div>
          <div className="area-container">
            <AreaChart />
          </div>

          <div className="income-and-outcome-buttons-container">
            <div className="income-button-container">
              <button className="material-icons">add</button>
              <h2 className="add-income-text">
                Add
                <br />
                Income
              </h2>
            </div>
            <div className="outcome-button-container">
              <button className="material-icons">remove</button>
              <h2 className="add-outcome-text">
                Add
                <br />
                Outcome
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
