import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy the existing chart (if any)
    const existingChart = chartRef.current.chart;
    if (existingChart) {
      existingChart.destroy();
    }

    // Create a new chart
    chartRef.current.chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {},
    });
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
