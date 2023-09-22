import React, { useContext, useState, useEffect } from "react";
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
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const light_theme_colors = {
  income: "rgba(255, 99, 132, 0.5)",
  outcome: "rgba(53, 162, 235, 0.5)",
};

const dark_theme_colors = {
  income: "rgba(255, 99, 132, 0.9)",
  outcome: "rgba(53, 162, 235, 0.9)",
};

export function BarChart({ transactionsVersion }) {
  const { theme } = useContext(ThemeContext);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      // Extract the current year
      const currentYear = new Date().getFullYear();

      const response = await axios.get(
        `/getMonthlyBalances/65087d99df86740bb4873eb8/${currentYear}`
      );
      setChartData(response.data);
    };

    fetchChartData();
  }, [transactionsVersion]);

  if (!chartData) {
    return null; // or you can return a loader or some placeholder content
  }

  // Prepare data arrays for income and outcome
  const incomeData = new Array(12).fill(0);
  const outcomeData = new Array(12).fill(0);

  chartData.forEach((entry) => {
    if (entry.month >= 0 && entry.month <= 11) {
      // To ensure month index is valid
      incomeData[entry.month] = entry.income;
      outcomeData[entry.month] = entry.outcome;
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: "income",
        data: incomeData,
        backgroundColor:
          theme === "light"
            ? light_theme_colors.income
            : dark_theme_colors.income,
      },
      {
        label: "outcome",
        data: outcomeData,
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
