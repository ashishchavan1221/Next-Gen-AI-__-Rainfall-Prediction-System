import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function PredictionChart({ labels, tempData, humData, windData }) {
  const chartRef = useRef(null)

  const data = {
    labels,
    datasets: [
        {
            label: 'Temperature (°C)',
            data: tempData,
            borderColor: '#F59E0B', 
            backgroundColor: (context) => {
                const ctx = context.chart.ctx
                const gradient = ctx.createLinearGradient(0, 0, 0, 300)
                gradient.addColorStop(0, 'rgba(245, 158, 11, 0.4)')
                gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)')
                return gradient
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0B0E14',
            pointBorderColor: '#F59E0B',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
        },
        {
            label: 'Humidity (%)',
            data: humData,
            borderColor: '#3B82F6', 
            backgroundColor: (context) => {
                const ctx = context.chart.ctx
                const gradient = ctx.createLinearGradient(0, 0, 0, 300)
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')
                return gradient
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0B0E14',
            pointBorderColor: '#3B82F6',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
        },
        {
            label: 'Wind Speed (km/h)',
            data: windData,
            borderColor: '#10B981', 
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#0B0E14',
            pointBorderColor: '#10B981',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y1'
        }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'top',
            labels: { usePointStyle: true, boxWidth: 8, color: '#94A3B8', font: { family: "'Space Grotesk', sans-serif" } }
        },
        tooltip: {
            backgroundColor: 'rgba(18, 22, 31, 0.9)',
            titleColor: '#F8FAFC',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            boxPadding: 4,
            titleFont: { family: "'Space Grotesk', sans-serif" },
            bodyFont: { family: "'Space Grotesk', sans-serif" }
        }
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Temp (°C) / Hum (%)', color: '#64748B' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Wind Speed (km/h)', color: '#64748B' },
            grid: { drawOnChartArea: false },
            ticks: { color: '#94A3B8' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#94A3B8' }
        }
    }
  }

  return <Line ref={chartRef} data={data} options={options} />
}
