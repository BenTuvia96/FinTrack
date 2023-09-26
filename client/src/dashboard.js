import React, { Component } from "react";
import ThemeContext from "./ThemeContext";
import TopBar from "./top_bar";
import { DoughnutChart } from "./dashboard_components/doughnut_chart.jsx";
import { BarChart } from "./dashboard_components/bar_chart";
import { AreaChart } from "./dashboard_components/area_chart";
import jwtDecode from "jwt-decode";
import OutcomeInput from "./dashboard_components/add_expense";
import IncomeInput from "./dashboard_components/add_income";
import "./dashboard.css";

class Dashboard extends Component {
  state = {
    showOutcomeInput: false,
    showIncomeInput: false,
    transactionsVersion: 0,
    selectedKind: "outcome",
    user: {
      userID: null,
      username: null,
      email: null,
    },
  };

  componentDidMount() {
    // Assuming you store the token in localStorage after login
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      this.setState({ userID: decoded.id });

      fetch("/getUserDetails", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            this.setState({
              user: {
                username: data.username,
                email: data.email,
              },
            });
          }
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }

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
    console.log("Dashboard rendered with userID:", this.state.userID);

    const userName = "dude";
    const { theme } = this.context;

    return (
      <div className={`dashboard_page_container ${theme}`}>
        <TopBar />
        <h2>hello {this.state.user.username || "dude"}</h2>
        <div className="dashboard-container">
          <div className="doughnut-container">
            <DoughnutChart
              userID={this.state.userID}
              transactionsVersion={this.state.transactionsVersion}
              kind={this.state.selectedKind}
            />
            <div className="toggle-container">
              <button
                className={`toggle ${
                  this.state.selectedKind === "income" ? "income" : "outcome"
                }`}
                onClick={this.handleToggleClick}
              >
                <div className="icons">
                  <i className="material-icons">remove</i>
                  <i className="material-icons">add</i>
                </div>
                <i
                  className={`material-icons round ${
                    this.state.selectedKind === "income" ? "show" : "hide"
                  }`}
                >
                  add
                </i>
                <i
                  className={`material-icons round ${
                    this.state.selectedKind === "income" ? "hide" : "show"
                  }`}
                >
                  remove
                </i>
              </button>
            </div>
          </div>
          <div className="bar-container">
            <BarChart
              userID={this.state.userID}
              transactionsVersion={this.state.transactionsVersion}
            />
          </div>
          <div className="area-container">
            <AreaChart
              userID={this.state.userID}
              transactionsVersion={this.state.transactionsVersion}
            />
          </div>
          <div className="input-form-container">
            {this.state.showOutcomeInput && (
              <OutcomeInput
                userID={this.state.userID}
                onFormSubmit={this.handleOutcomeFormSubmission}
              />
            )}
            {this.state.showIncomeInput && (
              <IncomeInput
                userID={this.state.userID}
                onFormSubmit={this.handleIncomeFormSubmission}
              />
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
