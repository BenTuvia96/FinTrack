import React, { useContext } from "react";
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

  const data = {
    labels: ["food", "rent", "bills", "entertainment", "other", "savings"],
    datasets: [
      {
        label: "amount spent in $",
        data: [12, 19, 3, 5, 2, 3],
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
  };

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

  return <Doughnut options={options} data={data} />;
}
