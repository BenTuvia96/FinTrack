import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import Papa from "papaparse";
import TopBar from "./top_bar";
import ThemeContext from "./ThemeContext";
import DateTimeSelector from "./date_time_selector";
import "./transactions.css";

const getQueryParams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return {
    category: urlParams.get("category") || "All",
  };
};

const exportToCSV = (transactions) => {
  const fieldsToExclude = ["_id", "user_id", "__v"];
  const filteredTransactions = transactions.map((transaction) => {
    const filteredTransaction = {};
    for (const key in transaction) {
      if (!fieldsToExclude.includes(key)) {
        filteredTransaction[key] = transaction[key];
      }
    }
    return filteredTransaction;
  });
  const csv = Papa.unparse(filteredTransactions);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "transactions.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function Transactions() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    userID: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { theme } = React.useContext(ThemeContext);

  const fetchUserTransactions = useCallback(
    (userID, startDate, endDate) => {
      let url = `/getTransactions/${userID}`;
      let queryParts = [];
      if (startDate && endDate) {
        queryParts.push(`startDate=${startDate.toISOString()}`);
        queryParts.push(`endDate=${endDate.toISOString()}`);
      }
      if (selectedCategory !== "All") {
        queryParts.push(`category=${selectedCategory}`);
      }
      if (queryParts.length > 0) {
        url += "?" + queryParts.join("&");
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setTransactions(data);
        })
        .catch((error) => console.error("Error fetching transactions:", error));
    },
    [selectedCategory]
  );

  const handleDateChange = (startDate, endDate) => {
    fetchUserTransactions(user.userID, startDate, endDate);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape" && isModalOpen) {
        setModalOpen(false);
      }
    },
    [isModalOpen]
  );

  useEffect(() => {
    const params = getQueryParams();
    setSelectedCategory(params.category);

    const token = localStorage.getItem("token");

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/getUserDetails", {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();

        if (data.username) {
          setUser({
            username: data.username,
            email: data.email,
            userID: data.userID,
          });
        }

        return data;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchCategories = async (userID) => {
      try {
        const response = await fetch(`/getCategories/${userID}`);
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (token) {
      fetchUserDetails().then((data) => {
        if (data && data.userID) {
          fetchUserTransactions(data.userID);
          fetchCategories(data.userID);
        }
      });
    }
  }, [fetchUserTransactions]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "time",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Note",
        accessor: "note",
      },
      {
        Header: "Kind",
        accessor: "kind",
      },
      {
        Header: "Actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div>
            <span
              className="material-icons"
              onClick={() => startEditing(row.original)}
            >
              edit
            </span>
            <span
              className="material-icons"
              onClick={(e) => deleteTransaction(row.original._id, e)}
            >
              delete
            </span>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: transactions }, useSortBy);

  const deleteTransaction = (transactionId, e) => {
    e.stopPropagation();

    fetch(`/deleteTransaction/${transactionId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions((currentTransactions) =>
            currentTransactions.filter((t) => t._id !== transactionId)
          );
        } else {
          console.error("Error deleting transaction:", data.error);
        }
      });
  };

  const startEditing = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`/editTransaction/${editingTransaction._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTransaction),
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(
          transactions.map((t) => (t._id === data._id ? data : t))
        );
        setModalOpen(false);
        fetchUserTransactions(user.userID);
      });
  };

  const safeDate = (time) => {
    const d = new Date(time);
    if (isNaN(d.getTime())) {
      return "";
    }
    return d.toISOString().split("T")[0];
  };

  const handleModalClick = (e) => {
    if (e.target.className === "modal") {
      setModalOpen(false);
    }
  };

  return (
    <div className={`transactions_page_container ${theme}`}>
      <TopBar header={`Transactions for ${user.username || "user"}`} />
      <div className="table_controls_container">
        <div className="category_selector_container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option
                key={category._id}
                value={category.name}
                style={{ color: category.type === "income" ? "green" : "red" }}
              >
                {category.name}
              </option>
            ))}
          </select>{" "}
        </div>

        <div className="date_time_selector_container">
          {/* TODO: add dark mode support for date selector text */}
          <DateTimeSelector
            className="date_time_selector"
            onDateChange={handleDateChange}
          />
        </div>
        <div className="share_button_container">
          <button
            className="share-button"
            onClick={() => exportToCSV(transactions)}
          >
            <i class="material-icons">ios_share</i>
          </button>
          <label className="export_label">Export to CSV</label>
        </div>
      </div>
      <div className="table_container">
        <table {...getTableProps()} className="transactions_table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={
                    row.original.kind === "income"
                      ? "incomeRow"
                      : row.original.kind === "outcome"
                      ? "outcomeRow"
                      : ""
                  }
                  onClick={() => startEditing(row.original)}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && editingTransaction && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <div className="close-icon-containter">
              <span
                className="material-icons close-icon"
                onClick={() => setModalOpen(false)}
              >
                close
              </span>
            </div>
            <h2>Edit Transaction</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Amount:
                <br />
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  value={editingTransaction.category}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      category: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Note:
                <input
                  type="text"
                  value={editingTransaction.note}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      note: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Kind:
                <select
                  value={editingTransaction.kind}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      kind: e.target.value,
                    })
                  }
                >
                  <option value="income">Income</option>
                  <option value="outcome">Expense</option>
                </select>
              </label>
              <label>
                Date:
                <input
                  type="date"
                  value={safeDate(editingTransaction.time)}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      time: e.target.value,
                    })
                  }
                />
              </label>
              <button className="submit-button" type="submit">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
