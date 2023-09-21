// yearly_comparison_chart.jsx

import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../ThemeContext";
import { Line } from "react-chartjs-2";
import axios from "axios";

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

const light_colors = {
  // create two options for two lines
  first_line: {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  },
  second_line: {
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  },
};

const dark_colors = {
  first_line: {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  },
  second_line: {
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.8)",
  },
};

export function YearlyComparisonChart({ transactionsVersion }) {
  const { theme } = useContext(ThemeContext);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const currentYear = new Date().getFullYear();
      const response = await axios.get(
        `/getYearlyComparisonBalances/65087d99df86740bb4873eb8/${currentYear}`
      );
      setChartData(response.data);
    };

    fetchChartData();
  }, [transactionsVersion]);

  if (!chartData) {
    return null;
  }

  // Extract data for current and previous years
  const currentYearBalance = labels.map((_, index) => {
    const monthData = chartData.currentYear.find(
      (entry) => entry.month === index
    );
    return monthData ? monthData.balance : 0;
  });

  const previousYearBalance = labels.map((_, index) => {
    const monthData = chartData.previousYear.find(
      (entry) => entry.month === index
    );
    return monthData ? monthData.balance : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: `Balance ${new Date().getFullYear()}`,
        data: currentYearBalance,
        borderColor:
          theme === "light"
            ? light_colors.first_line.borderColor
            : dark_colors.first_line.borderColor,
        backgroundColor:
          theme === "light"
            ? light_colors.first_line.backgroundColor
            : dark_colors.first_line.backgroundColor,
        fill: true,
      },
      {
        label: `Balance ${new Date().getFullYear() - 1}`,
        data: previousYearBalance,
        borderColor:
          theme === "light"
            ? light_colors.second_line.borderColor
            : dark_colors.second_line.borderColor,
        backgroundColor:
          theme === "light"
            ? light_colors.second_line.backgroundColor
            : dark_colors.second_line.backgroundColor,
        fill: true,
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
        text: "Yearly Comparison of Monthly Balance",
        color: theme === "dark" ? "white" : "black",
      },
      tooltip: {
        titleFontColor: theme === "dark" ? "white" : "black",
        bodyFontColor: theme === "dark" ? "white" : "black",
        footerFontColor: theme === "dark" ? "white" : "black",
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

  return <Line options={options} data={data} />;
}

export default YearlyComparisonChart;
