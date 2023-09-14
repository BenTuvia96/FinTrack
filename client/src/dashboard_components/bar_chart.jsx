import React, { useContext } from "react";
import ThemeContext from "../ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const light_theme_colors = {
  income: "rgba(255, 99, 132, 0.5)",
  outcome: "rgba(53, 162, 235, 0.5)",
};

const dark_theme_colors = {
  income: "rgba(255, 99, 132, 0.9)",
  outcome: "rgba(53, 162, 235, 0.9)",
};

export function BarChart() {
  const { theme } = useContext(ThemeContext);

  const data = {
    labels,
    datasets: [
      {
        label: "income",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor:
          theme === "light"
            ? light_theme_colors.income
            : dark_theme_colors.income,
      },
      {
        label: "outcome",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor:
          theme === "light"
            ? light_theme_colors.outcome
            : dark_theme_colors.outcome,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme === "dark" ? "white" : "black",
        },
      },
      title: {
        display: true,
        text: "Income & Outcome by Month",
        color: theme === "dark" ? "white" : "black",
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === "dark" ? "white" : "black",
        },
        grid: {
          color: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      y: {
        ticks: {
          color: theme === "dark" ? "white" : "black",
        },
        grid: {
          color: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
}
