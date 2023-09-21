import React, { useContext } from "react";
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
import { faker } from "@faker-js/faker";

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

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export function AreaChart() {
  const { theme } = useContext(ThemeContext);

  const light_colors = {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };

  const dark_colors = {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.8)", // Made this less transparent for the dark theme
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Money Saved",
        data: labels.map(() => faker.datatype.number({ min: -500, max: 1000 })),
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
          color: theme === "dark" ? "white" : "black", // Adjust legend color based on theme
        },
      },
      title: {
        display: true,
        text: "Money Saved by Month",
        color: theme === "dark" ? "white" : "black", // Adjust title color based on theme
      },
      tooltip: {
        titleFontColor: theme === "dark" ? "white" : "black", // Adjust tooltip title color
        bodyFontColor: theme === "dark" ? "white" : "black", // Adjust tooltip body color
        footerFontColor: theme === "dark" ? "white" : "black", // Adjust tooltip footer color
      },
    },
  };

  return <Line options={options} data={data} />;
}
