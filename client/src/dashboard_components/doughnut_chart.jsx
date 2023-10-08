import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../ThemeContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import DateTimeSelector from "../date_time_selector.jsx";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const light_theme_colors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

const dark_theme_colors = [
  "rgba(255, 99, 132, 0.75)",
  "rgba(54, 162, 235, 0.75)",
  "rgba(255, 206, 86, 0.75)",
  "rgba(75, 192, 192, 0.75)",
  "rgba(153, 102, 255, 0.75)",
  "rgba(255, 159, 64, 0.75)",
];

export function DoughnutChart({ transactionsVersion, kind, userID }) {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  const [startDate, setStartDate] = useState(fiveYearsAgo);
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    if (userID) {
      // Constructing the URL with the query parameters
      const url = `/getTransactions/${userID}${
        startDate && endDate
          ? `?startDate=${startDate.toISOString().split("T")[0]}&endDate=${
              endDate.toISOString().split("T")[0]
            }`
          : ""
      }`;

      fetch(url)
        .then((response) => response.json())
        .then((transactions) => {
          console.log("Received transactions:", transactions);

          // Filter out only 'outcome' or 'income' transactions
          const displayedTransactions =
            kind === "outcome"
              ? transactions.filter(
                  (transaction) => transaction.kind === "outcome"
                )
              : transactions.filter(
                  (transaction) => transaction.kind === "income"
                );

          // Create an object to tally amounts by category
          let amountsByCategory = {};
          displayedTransactions.forEach((transaction) => {
            if (!amountsByCategory[transaction.category]) {
              amountsByCategory[transaction.category] = 0;
            }
            amountsByCategory[transaction.category] += transaction.amount;
          });

          // Prepare the data in the format needed by the Doughnut chart
          setChartData({
            labels: Object.keys(amountsByCategory),
            datasets: [
              {
                label: kind === "outcome" ? "amount spent" : "amount earned",
                data: Object.values(amountsByCategory),
                backgroundColor:
                  theme === "light" ? light_theme_colors : dark_theme_colors,
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
        });
    }
  }, [theme, transactionsVersion, kind, userID, startDate, endDate]);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: theme === "dark" ? "white" : "black",
        },
      },
      title: {
        display: true,
        // TODO: add precentege
        text: kind === "outcome" ? "Expense by Category" : "Income by Category",
        color: theme === "dark" ? "white" : "black",
      },
      tooltip: {
        titleFontColor: theme === "dark" ? "white" : "black",
        bodyFontColor: theme === "dark" ? "white" : "black",
        footerFontColor: theme === "dark" ? "white" : "black",
      },
    },
    onClick: (event, element, chart) => {
      if (element.length > 0) {
        const categoryLabel = chart.data.labels[element[0].index];
        // Use the navigate function to redirect without a full page refresh
        navigate(`/transactions?category=${categoryLabel}`);
      }
    },
  };

  return (
    <div>
      <DateTimeSelector
        onDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />
      <Doughnut options={options} data={chartData} />
    </div>
  );
}
