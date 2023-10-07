import React, { useState, useEffect } from "react";
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
  const [categories, setCategories] = useState([]);
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAmountSubmit = (event) => {
    event.preventDefault();
    setHasEnteredAmount(true);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if (event.target.value === "add-category") {
      setShowNewCategoryField(true);
    } else {
      setShowNewCategoryField(false);
    }
  };

  const handleNewCategoryNameChange = (event) => {
    setNewCategoryName(event.target.value);
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

    const addIncome = (categoryOverride) => {
      axios
        .post("http://localhost:3001/AddIncome", {
          user_id: props.userID,
          amount: amount,
          category: categoryOverride || selectedCategory,
          date: selectedDate,
          note: note,
          kind: "income",
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

    if (showNewCategoryField) {
      axios
        .post(`http://localhost:3001/addCategory/${props.userID}`, {
          name: newCategoryName,
          type: "income",
        })
        .then((response) => {
          addIncome(newCategoryName);
        })
        .catch((error) => {
          console.error("Error adding new category:", error);
        });
    } else {
      addIncome();
    }
  };

  useEffect(() => {
    // Fetch user categories on component mount using the dedicated endpoint
    axios
      .get(`http://localhost:3001/getCategories/${props.userID}`)
      .then((response) => {
        // Filter out only the "income" categories
        const incomeCategories = response.data.filter(
          (category) => category.type === "income"
        );
        setCategories(incomeCategories);
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
            {showNewCategoryField && (
              <label>
                New Category Name:
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={handleNewCategoryNameChange}
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
