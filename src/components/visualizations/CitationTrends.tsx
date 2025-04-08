import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['2018', '2019', '2020', '2021', '2022'],
  datasets: [
    {
      label: 'Papers Published',
      data: [12, 19, 3, 5, 2],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Citation Trends Over Time',
    },
  },
};

export function CitationTrends() {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <Line data={data} options={options} />
    </div>
  );
}