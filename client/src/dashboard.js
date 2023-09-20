import React, { Component, useContext } from "react";
import ThemeContext from "./ThemeContext";
import TopBar from "./top_bar";
import { DoughnutChart } from "./dashboard_components/doughnut_chart.jsx";
import { BarChart } from "./dashboard_components/bar_chart";
import { AreaChart } from "./dashboard_components/area_chart";
import OutcomeInput from "./dashboard_components/add_expense";
import IncomeInput from "./dashboard_components/add_income";
import "./dashboard.css";

class Dashboard extends Component {
  state = {
    showOutcomeInput: false,
    showIncomeInput: false,
  };

  toggleOutcomeInput = () => {
    this.setState((prevState) => ({
      showOutcomeInput: !prevState.showOutcomeInput,
      showIncomeInput: false, // Close income input when outcome input is opened
    }));
  };

  toggleIncomeInput = () => {
    this.setState((prevState) => ({
      showIncomeInput: !prevState.showIncomeInput,
      showOutcomeInput: false, // Close outcome input when income input is opened
    }));
  };

  static contextType = ThemeContext;

  render() {
    const { theme } = this.context;

    return (
      <div className={`dashboard_page_container ${theme}`}>
        <TopBar />
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
          <div className="input-form-container">
            {this.state.showOutcomeInput && <OutcomeInput />}
            {this.state.showIncomeInput && <IncomeInput />}
          </div>
          <div className="income-and-outcome-buttons-container">
            <div className="income-button-container">
              <button
                className="material-icons"
                onClick={this.toggleIncomeInput}
              >
                add
              </button>
              <h2 className="add-income-text" onClick={this.toggleIncomeInput}>
                Add
                <br />
                Income
              </h2>
            </div>
            <div className="outcome-button-container">
              <button
                className="material-icons"
                onClick={this.toggleOutcomeInput}
              >
                remove
              </button>
              <h2
                className="add-outcome-text"
                onClick={this.toggleOutcomeInput}
              >
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
