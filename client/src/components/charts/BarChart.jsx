import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, title = "Bar Chart" }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!data) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No data available for bar chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;