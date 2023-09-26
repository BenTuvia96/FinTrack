import React, { useState } from "react";
import axios from "axios";
import "./add_income_or_expense_form.css";

const AddIncome = (props) => {
  const [amount, setAmount] = useState("");
  const [hasEnteredAmount, setHasEnteredAmount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [note, setNote] = useState("");

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAmountSubmit = (event) => {
    event.preventDefault();
    setHasEnteredAmount(true);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const resetForm = () => {
    setAmount("");
    setHasEnteredAmount(false);
    setSelectedCategory("");
    setSelectedDate(new Date().toISOString().substr(0, 10));
    setNote("");
  };

  const handleFinalSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/AddIncome", {
        user_id: props.userID,
        amount: amount,
        category: selectedCategory,
        date: selectedDate,
        note: note,
        kind: "outcome",
      })
      .then((response) => {
        console.log(response.data);
        resetForm();
        props.onFormSubmit && props.onFormSubmit();
      })
      .catch((error) => {
        console.error("Error during income addition:", error);
      });
  };

  return (
    <div className="income-outcome-form-container">
      {hasEnteredAmount ? (
        <>
          <h2>Choose a Category</h2>
          <form onSubmit={handleFinalSubmit}>
            <label>
              Category:
              <select
                className="category-selector"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value=""></option>
                <option value="salary">Salary</option>
                <option value="deposit">Deposit</option>
                <option value="savings">Savings</option>
                <option value="gift">Gift</option>
                <option value="other">Other</option>
                <option value="add-category">Add</option>
              </select>
            </label>
            <label>
              Date (optional):
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </label>

            <label>
              Note (optional):
              <input type="text" value={note} onChange={handleNoteChange} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <>
          <h2>Add income:</h2>
          <form onSubmit={handleAmountSubmit}>
            <label>
              How much?
              <input type="text" value={amount} onChange={handleAmountChange} />
            </label>
            <button type="submit">Next</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddIncome;
