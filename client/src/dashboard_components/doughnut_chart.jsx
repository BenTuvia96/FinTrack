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

export function DoughnutChart() {
  const { theme } = useContext(ThemeContext);

  // State for the fetched data
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Fetch data from the server
    fetch("/getTransactions")
      .then((response) => response.json())
      .then((transactions) => {
        // Filter out only 'outcome' transactions
        const outcomeTransactions = transactions.filter(
          (transaction) => transaction.kind === "outcome"
        );

        // Create an object to tally amounts by category
        let amountsByCategory = {};
        outcomeTransactions.forEach((transaction) => {
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
              label: "amount spent in $",
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
  }, [theme]); // Refetch data if theme changes, or remove theme from dependency if you don't want to refetch

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
        text: "Expenses by Category",
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
