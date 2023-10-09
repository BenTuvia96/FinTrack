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
import { useNavigate } from "react-router-dom";

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

export function BarChart({ userID, transactionsVersion }) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (userID) {
      const fetchChartData = async () => {
        const currentYear = new Date().getFullYear();
        const response = await axios.get(
          `/getMonthlyBalances/${userID}/${currentYear}`
        );
        setChartData(response.data);
      };

      fetchChartData();
    }
  }, [transactionsVersion, userID]);

  if (!chartData) {
    return null;
  }

  const incomeData = new Array(12).fill(0);
  const outcomeData = new Array(12).fill(0);

  chartData.forEach((entry) => {
    if (entry.month >= 0 && entry.month <= 11) {
      incomeData[entry.month] = entry.income;
      outcomeData[entry.month] = -entry.outcome; // Convert outcome to negative
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor:
          theme === "light"
            ? light_theme_colors.income
            : dark_theme_colors.income,
      },
      {
        label: "Outcome",
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
        stacked: true,
        ticks: {
          color: theme === "dark" ? "white" : "black",
        },
        grid: {
          color: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      y: {
        stacked: true, // This makes the bar chart stacked
        ticks: {
          color: theme === "dark" ? "white" : "black",
        },
        grid: {
          color: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
    onClick: (event, element, chart) => {
      if (element.length > 0) {
        const monthLabel = chart.data.labels[element[0].index];
        const currentYear = new Date().getFullYear();
        const date = new Date(`${monthLabel} 1, ${currentYear}`);
        const startDate = date.toISOString().split("T")[0];
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        const endDate = date.toISOString().split("T")[0];

        // Check whether the clicked bar is income or outcome
        const kind =
          chart.data.datasets[element[0].datasetIndex].label.toLowerCase(); // This will be "income" or "outcome"

        navigate(
          `/transactions?startDate=${startDate}&endDate=${endDate}&kind=${kind}`
        );
      }
    },
  };

  return <Bar options={options} data={data} />;
}
