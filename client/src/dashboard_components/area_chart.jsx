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

export function AreaChart({ transactionsVersion }) {
  const { theme } = useContext(ThemeContext);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const currentYear = new Date().getFullYear();

      const response = await axios.get(
        `/getMonthlyBalances/65087d99df86740bb4873eb8/${currentYear}`
      );
      setChartData(response.data);
    };

    fetchChartData();
  }, [transactionsVersion]);

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
  };

  return <Line options={options} data={data} />;
}
