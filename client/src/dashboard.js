import React, { Component } from "react";
import ThemeContext from "./ThemeContext";
import TopBar from "./top_bar";
import { DoughnutChart } from "./dashboard_components/doughnut_chart.jsx";
import { BarChart } from "./dashboard_components/bar_chart";
import { AreaChart } from "./dashboard_components/area_chart";
import OutcomeInput from "./dashboard_components/add_expense";
import IncomeInput from "./dashboard_components/add_income";
import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

class Dashboard extends Component {
  state = {
    showOutcomeInput: false,
    showIncomeInput: false,
    transactionsVersion: 0,
    selectedKind: "outcome",
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

  handleOutcomeFormSubmission = () => {
    this.toggleOutcomeInput();
    this.setState((prevState) => ({
      transactionsVersion: prevState.transactionsVersion + 1,
    }));
  };

  handleIncomeFormSubmission = () => {
    this.toggleIncomeInput();
    this.setState((prevState) => ({
      transactionsVersion: prevState.transactionsVersion + 1,
    }));
  };

  static contextType = ThemeContext;

  handleToggleClick = () => {
    this.setState((prevState) => ({
      selectedKind: prevState.selectedKind === "income" ? "outcome" : "income",
    }));
  };

  render() {
    const { theme } = this.context;

    return (
      <div className={`dashboard_page_container ${theme}`}>
        <TopBar />
        <div className="dashboard-container">
          <div className="doughnut-container">
            <DoughnutChart
              transactionsVersion={this.state.transactionsVersion}
              kind={this.state.selectedKind}
            />
            <section className="toggle-container">
              <button
                className={`toggle ${
                  this.state.selectedKind === "income" ? "active" : ""
                }`}
                onClick={this.handleToggleClick}
              >
                <div className="icons">
                  <FontAwesomeIcon icon={faMinus} />
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <FontAwesomeIcon
                  icon={this.state.selectedKind === "income" ? faPlus : faMinus}
                  className="round"
                />
              </button>
            </section>
          </div>
          <div className="bar-container">
            <BarChart />
          </div>
          <div className="area-container">
            <AreaChart />
          </div>
          <div className="input-form-container">
            {this.state.showOutcomeInput && (
              <OutcomeInput onFormSubmit={this.handleOutcomeFormSubmission} />
            )}
            {this.state.showIncomeInput && (
              <IncomeInput onFormSubmit={this.handleIncomeFormSubmission} />
            )}
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
