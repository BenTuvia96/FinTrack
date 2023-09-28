import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import TopBar from "./top_bar";
import ThemeContext from "./ThemeContext";
import "./transactions.css";

function Transactions() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    userID: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { theme } = React.useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("/getUserDetails", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUser({
              username: data.username,
              email: data.email,
              userID: data.userID,
            });
            fetchUserTransactions(data.userID);
          }
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, []);

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
              onClick={() => deleteTransaction(row.original._id)}
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

  const fetchUserTransactions = (userID) => {
    fetch(`/getTransactions/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  const deleteTransaction = (transactionId) => {
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

  return (
    <div className={`transactions_page_container ${theme}`}>
      <TopBar header={`Transactions for ${user.username || "user"}`} />
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
                <tr {...row.getRowProps()}>
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
        <div className="modal">
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
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
