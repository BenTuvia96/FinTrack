import React, { useState, useEffect } from "react";
import axios from "axios";
import "./add_income_or_expense_form.css";

const AddExpense = (props) => {
  const [amount, setAmount] = useState("");
  const [hasEnteredAmount, setHasEnteredAmount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState([]);

  const addExpense = (categoryOverride) => {
    axios
      .post("http://localhost:3001/addExpense", {
        user_id: props.userID,
        amount: amount,
        category: categoryOverride || selectedCategory,
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
        console.error("Error during expense addition:", error);
      });
  };

  const handleFinalSubmit = (event) => {
    event.preventDefault();

    if (selectedCategory === "add-category") {
      axios
        .post(`http://localhost:3001/addCategory/${props.userID}`, {
          name: newCategoryName,
          type: "outcome",
        })
        .then((response) => {
          addExpense(newCategoryName);
        })
        .catch((error) => {
          console.error("Error adding new category:", error);
        });
    } else {
      addExpense();
    }
  };

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

  useEffect(() => {
    // Fetch user categories on component mount using the dedicated endpoint
    axios
      .get(`http://localhost:3001/getCategories/${props.userID}`)
      .then((response) => {
        // Filter out only the "outcome" categories
        const outcomeCategories = response.data.filter(
          (category) => category.type === "outcome"
        );
        setCategories(outcomeCategories);
      })
      .catch((error) => {
        console.error("Error fetching user categories:", error);
      });
  }, [props.userID]);

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
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
                <option value="add-category">Add</option>
              </select>
            </label>
            {selectedCategory === "add-category" && (
              <label>
                New Category Name:
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </label>
            )}
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
          <h2>Add Expense:</h2>
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

export default AddExpense;
