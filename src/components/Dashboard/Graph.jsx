import React, { useRef, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale, Legend);

const Graph = ({ graphData }) => {
  const chartRef = useRef(null);

  // Cleanup chart instance on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const chartData = useMemo(() => {
    if (!graphData || graphData.length === 0) {
      return { labels: ["No Data"], values: [0] };
    }
    const labels = graphData.map((item) => item.clickDate);
    const values = graphData.map((item) => item.count);
    return { labels, values };
  }, [graphData]);

  const data = useMemo(
    () => ({
      labels: chartData.labels,
      datasets: [
        {
          label: "Total Clicks",
          data: chartData.values,
          backgroundColor: "#3b82f6",
          borderColor: "#1e40af",
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 30,
          maxBarThickness: 50,
        },
      ],
    }),
    [chartData]
  );

  const options = useMemo(
    () => ({
      indexAxis: "x",
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 500,
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 12,
              weight: "500",
            },
            color: "#374151",
            padding: 15,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#3b82f6",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return `Clicks: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: "#6b7280",
            padding: 8,
            callback: function (value) {
              if (Number.isInteger(value)) {
                return value;
              }
              return "";
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: "#6b7280",
            maxRotation: 45,
            minRotation: 0,
          },
        },
      },
    }),
    []
  );

  return (
    <div style={{ width: "100%", height: "384px", position: "relative" }}>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default React.memo(Graph);
