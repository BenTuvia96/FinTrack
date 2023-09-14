import React, { Component } from "react";
import "./add_expanse.css"; // Import your CSS styles for this component

class AddExpense extends Component {
  state = {
    amount: "",
    hasEnteredAmount: false,
    selectedCategory: "", // Add a state variable for the selected category
    selectedDate: "", // Add a state variable for the selected date
    note: "", // Add a state variable for the note input
  };

  componentDidMount() {
    // Set the default date to the current date when the component is mounted
    if (!this.state.selectedDate) {
      const currentDate = new Date().toISOString().substr(0, 10);
      this.setState({ selectedDate: currentDate });
    }
  }

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleAmountSubmit = (event) => {
    event.preventDefault();
    const { amount } = this.state;

    // Perform any necessary actions with the 'amount' data here
    // For example, you can send it to your backend or update your application's state

    // Update the state to indicate that the user has entered the amount
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

  render() {
    const { amount, hasEnteredAmount, selectedCategory, selectedDate, note } =
      this.state;

    return (
      <div className="add-expense-container">
        {hasEnteredAmount ? (
          <>
            <h2>Choose a Category</h2>
            <form onSubmit={this.handleCategorySubmit}>
              <label>
                Category:
                <select
                  value={selectedCategory}
                  onChange={this.handleCategoryChange}
                >
                  <option value="food">Food</option>
                  <option value="rent">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="bills">Bills</option>
                  <option value="rent">rent</option>
                  <option value="other">Other</option>
                  <option value="add-category">Add</option>
                  {/* Add more category options as needed */}
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
              <button type="submit">Submit</button>
            </form>
          </>
        )}
      </div>
    );
  }
}

export default AddExpense;
