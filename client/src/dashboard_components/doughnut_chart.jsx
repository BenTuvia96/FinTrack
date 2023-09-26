import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../ThemeContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

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
  const { theme } = useContext(ThemeContext);

  // State for the fetched data
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (userID) {
      // Check for truthy value, so if it's not null, undefined, etc.
      // Fetch data from the server
      fetch(`/getTransactions/${userID}`)
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
  }, [theme, transactionsVersion, kind, userID]);

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
        text: kind === "outcome" ? "Expense by Category" : "Income by Category",
        color: theme === "dark" ? "white" : "black",
      },
      tooltip: {
        titleFontColor: theme === "dark" ? "white" : "black",
        bodyFontColor: theme === "dark" ? "white" : "black",
        footerFontColor: theme === "dark" ? "white" : "black",
      },
    },
  };

  return <Doughnut options={options} data={chartData} />;
}
