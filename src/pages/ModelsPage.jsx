import React, { useState } from 'react'
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
import { Scatter, Line } from 'react-chartjs-2'

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

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState('scatter')

  // Generate synthetic data to demonstrate the threshold ML logic described in the notebook
  const generateScatterData = () => {
    const data = []
    for (let i = 0; i < 200; i++) {
       const temp = 10 + Math.random() * 30
       const hum = 40 + Math.random() * 60
       let risk = 0 // 0=Low, 1=Likely, 2=High
       // The exact logic from the Python Notebook
       if (hum > 90 && temp < 20) risk = 2
       else if (hum > 85) risk = 1
       
       data.push({
           x: temp,
           y: hum,
           risk
       })
    }
    return data
  }

  const chartData = generateScatterData()

  const scatterData = {
    datasets: [
      {
        label: 'High Risk Flood Cluster',
        data: chartData.filter(d => d.risk === 2),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Danger red
        borderColor: 'rgba(239, 68, 68, 1)',
        pointRadius: 6,
      },
      {
        label: 'Flood Likely Cluster',
        data: chartData.filter(d => d.risk === 1),
        backgroundColor: 'rgba(234, 179, 8, 0.8)', // Warning yellow
        borderColor: 'rgba(234, 179, 8, 1)',
        pointRadius: 5,
      },
      {
        label: 'No Flood Cluster',
        data: chartData.filter(d => d.risk === 0),
        backgroundColor: 'rgba(56, 189, 248, 0.5)', // Info blue
        borderColor: 'rgba(56, 189, 248, 1)',
        pointRadius: 4,
      }
    ],
  }

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8' }
      },
      title: {
        display: true,
        text: 'Temperature vs Humidity Decision Boundary',
        color: '#f8fafc',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Temp: ${context.raw.x.toFixed(1)}°C | Hum: ${context.raw.y.toFixed(1)}%`
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Temperature (°C)', color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, text: 'Humidity (%)', color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  }

  // Time series Risk Progression
  const lineData = {
    labels: ['Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today', 'Day +1', 'Day +2', 'Day +3'],
    datasets: [
      {
        label: 'Calculated Flood Risk Probability',
        data: [12, 15, 10, 20, 45, 88, 92, 60, 30],
        fill: true,
        borderColor: '#8b5cf6', // Accent
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4
      },
      {
        label: 'Rainfall Amount (mm)',
        data: [5, 0, 2, 8, 40, 150, 210, 80, 20],
        fill: false,
        borderColor: '#0ea5e9', // Primary
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  }


  return (
    <div className="pointer-events-auto">
      <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Machine Learning Models</h1>
          <p className="text-slate-400 mb-0">Visualizing the logic and decision boundaries used to predict extreme weather.</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('scatter')}
           className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'scatter' ? 'bg-primary text-white shadow-glow' : 'bg-darker border border-secondary text-slate-400 hover:text-white'}`}>
           <i className="fa-solid fa-chart-scatter me-2"></i> Decision Boundary
        </button>
        <button onClick={() => setActiveTab('line')}
           className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'line' ? 'bg-primary text-white shadow-glow' : 'bg-darker border border-secondary text-slate-400 hover:text-white'}`}>
           <i className="fa-solid fa-chart-line me-2"></i> Risk Progression
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 relative w-full h-[600px]">
         {activeTab === 'scatter' ? (
             <Scatter options={scatterOptions} data={scatterData} />
         ) : (
             <Line options={lineOptions} data={lineData} />
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-3"><i className="fa-solid fa-microchip text-primary me-2"></i>Threshold Architecture</h3>
              <p className="text-slate-400 text-sm mb-4">
                  The current model evaluates environmental metrics against historical extreme-weather bounds. High risk is triggered optimally when Temperature drops below 20°C concurrently with Humidity crossing 90%.
              </p>
              <div className="bg-darker p-3 rounded-lg font-mono text-xs text-info border border-secondary/50">
                  <span className="text-accent">if</span> (rain <span className="text-warning">&gt;</span> 200 <span className="text-accent">and</span> hum <span className="text-warning">&gt;</span> 90 <span className="text-accent">and</span> temp <span className="text-warning">&lt;</span> 20):<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-300">return</span> <span className="text-success">"High Risk Flood"</span>
              </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-warning/30">
              <h3 className="text-lg font-bold text-white mb-3"><i className="fa-solid fa-triangle-exclamation text-warning me-2"></i>Model Limitations</h3>
              <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                  <li>Deterministic thresholds may yield false positives in tropical climates with naturally high humidity.</li>
                  <li>Does not currently incorporate topographical elevation data for localized flood mapping.</li>
                  <li>Long-term accuracy diminishes beyond the 5-day forecast horizon.</li>
              </ul>
          </div>
      </div>
    </div>
  )
}
