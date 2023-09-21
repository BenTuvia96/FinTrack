import React, { Component } from "react";
import axios from "axios";
import "./add_expanse.css";

class AddExpense extends Component {
  state = {
    amount: "",
    hasEnteredAmount: false,
    selectedCategory: "",
    selectedDate: "",
    note: "",
  };

  componentDidMount() {
    const currentDate = new Date().toISOString().substr(0, 10);
    this.setState({ selectedDate: currentDate });
  }

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleAmountSubmit = (event) => {
    event.preventDefault();
    this.setState({ hasEnteredAmount: true });
  };

  handleCategoryChange = (event) => {
    this.setState({ selectedCategory: event.target.value });
  };

  handleDateChange = (event) => {
    this.setState({ selectedDate: event.target.value });
  };

  handleNoteChange = (event) => {
    this.setState({ note: event.target.value });
  };

  resetForm = () => {
    const currentDate = new Date().toISOString().substr(0, 10);
    this.setState({
      amount: "",
      hasEnteredAmount: false,
      selectedCategory: "",
      selectedDate: currentDate,
      note: "",
    });
  };

  handleFinalSubmit = (event) => {
    event.preventDefault();

    const { amount, selectedCategory, selectedDate, note } = this.state;

    axios
      .post("http://localhost:3001/addExpense", {
        user_id: "65087d99df86740bb4873eb8", //TODO: Add acutal user id from 'session'
        amount: amount,
        category: selectedCategory,
        date: selectedDate,
        note: note,
        kind: "outcome",
      })
      .then((response) => {
        console.log(response.data);
        this.resetForm();
        this.props.onFormSubmit && this.props.onFormSubmit();
      })
      .catch((error) => {
        console.error("Error during expense addition:", error);
      });
  };

  render() {
    const { amount, hasEnteredAmount, selectedCategory, selectedDate, note } =
      this.state;

    return (
      <div className="add-expense-container">
        {hasEnteredAmount ? (
          <>
            <h2>Choose a Category</h2>
            <form onSubmit={this.handleFinalSubmit}>
              <label>
                Category:
                <select
                  value={selectedCategory}
                  onChange={this.handleCategoryChange}
                >
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="bills">Bills</option>
                  <option value="rent">Rent</option>
                  <option value="other">Other</option>
                  <option value="add-category">Add</option>
                </select>
              </label>
              <label>
                Date (optional):
                <input
                  type="date"
                  value={selectedDate}
                  onChange={this.handleDateChange}
                />
              </label>

              <label>
                Note (optional):
                <input
                  type="text"
                  value={note}
                  onChange={this.handleNoteChange}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </>
        ) : (
          <>
            <h2>Add Expense:</h2>
            <form onSubmit={this.handleAmountSubmit}>
              <label>
                How much?
                <input
                  type="text"
                  value={amount}
                  onChange={this.handleAmountChange}
                />
              </label>
              <button type="submit"> Next</button>
            </form>
          </>
        )}
      </div>
    );
  }
}

export default AddExpense;
