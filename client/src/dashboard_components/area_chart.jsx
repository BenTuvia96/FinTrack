import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
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

const light_colors = {
  borderColor: "rgb(53, 162, 235)",
  backgroundColor: "rgba(53, 162, 235, 0.5)",
};

const dark_colors = {
  borderColor: "rgb(53, 162, 235)",
  backgroundColor: "rgba(53, 162, 235, 0.8)",
};

export function AreaChart({ userID, transactionsVersion }) {
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
  }, [userID, transactionsVersion]);

  if (!chartData) {
    return null;
  }

  const balanceData = labels.map((_, index) => {
    const monthData = chartData.find((entry) => entry.month === index);
    return monthData ? monthData.balance : 0; // Use the balance if monthData exists, otherwise default to 0
  });

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Monthly Balance",
        data: balanceData,
        borderColor:
          theme === "light"
            ? light_colors.borderColor
            : dark_colors.borderColor,
        backgroundColor:
          theme === "light"
            ? light_colors.backgroundColor
            : dark_colors.backgroundColor,
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
        text: "Monthly Balance by Month",
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
    onClick: (event, element, chart) => {
      if (element.length > 0) {
        const monthLabel = chart.data.labels[element[0].index];
        const currentYear = new Date().getFullYear();

        // Convert month label to date range
        const date = new Date(`${monthLabel} 1, ${currentYear}`);
        const startDate = date.toISOString().split("T")[0];
        date.setMonth(date.getMonth() + 1);
        date.setDate(0); // Setting the day to 0 will set the date to the last day of the previous month
        const endDate = date.toISOString().split("T")[0];

        // Use the navigate function to redirect with the appropriate date filtering
        navigate(`/transactions?startDate=${startDate}&endDate=${endDate}`);
      }
    },
  };

  return <Line options={options} data={data} />;
}
