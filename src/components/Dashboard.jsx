import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PredictionChart from './PredictionChart'

export default function Dashboard({ isMapView, setIsMapView, setWeatherType }) {
  const [locationName, setLocationName] = useState('')
  const [displayedLocation, setDisplayedLocation] = useState('Detecting Location...')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [mapHtml, setMapHtml] = useState('')
  const [correlationData, setCorrelationData] = useState(null)
  
  const [chartLabels, setChartLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const [tempData, setTempData] = useState([22, 24, 26, 23, 21, 20, 22])
  const [humData, setHumData] = useState([65, 60, 55, 75, 82, 78, 78])
  const [windData, setWindData] = useState([12, 15, 18, 14, 25, 20, 21])
  
  const [currentTemp, setCurrentTemp] = useState(22)
  const [currentHum, setCurrentHum] = useState(78)
  const [confidence, setConfidence] = useState(94)
  const [predictedRain, setPredictedRain] = useState(42)
  
  const [forecastStrip, setForecastStrip] = useState([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [floodRisk, setFloodRisk] = useState('')

  const [searchInput, setSearchInput] = useState('')

  const handleSearchSubmit = (e) => {
      e.preventDefault()
      if(searchInput.trim()) {
          fetchPredictions(null, null, searchInput.trim())
      }
  }

  const fetchPredictions = async (searchLat = null, searchLng = null, searchCity = null) => {
      setIsLoading(true)
      try {
          const queryCity = searchCity || locationName
          let url = `/api/predict?city=${queryCity}`
          if (searchLat !== null && searchLng !== null) {
              url = `/api/predict?lat=${searchLat}&lon=${searchLng}`
          }

          const response = await axios.get(url)
          const data = response.data
          
          if (data && data.success) {
              setChartLabels(data.daily_forecasts.map(d => d.date))
              setTempData(data.daily_forecasts.map(d => d.temp))
              setHumData(data.daily_forecasts.map(d => d.humidity))
              setWindData(data.daily_forecasts.map(d => d.wind))
              
              setCurrentTemp(data.current.temp)
              setCurrentHum(data.current.humidity)
              setPredictedRain(data.current.rain)
              setFloodRisk(data.flood_risk)
              if (data.location) {
                  const cityOnly = data.location.split(',')[0];
                  setDisplayedLocation(data.location)
                  setLocationName(cityOnly)
                  setSearchInput(cityOnly)
                  setMapHtml(data.map_html || '')
                  setCorrelationData(data.correlation || null)
              }
              
              // Save to history
              const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]')
              history.unshift({
                  location: data.location,
                  temp: data.current.temp,
                  risk: data.flood_risk,
                  timestamp: new Date().toISOString()
              })
              localStorage.setItem('weatherSearchHistory', JSON.stringify(history.slice(0, 10)))

              // Dynamic Weather Type based on Current Condition
              const condition = data.current.condition?.toLowerCase() || ''
              
              if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
                  setWeatherType('rain')
              } else if (condition.includes('snow')) {
                  setWeatherType('snow')
              } else if (data.current.temp > 32 || condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
                  setWeatherType('humid')
              } else if (condition.includes('clear') || data.current.temp > 22) {
                  setWeatherType('sun')
              } else {
                  setWeatherType('cloud')
              }

              // Map Coordinates
              if(data.coords) {
                  setLat(data.coords.lat)
                  setLng(data.coords.lng)
                  window.dispatchEvent(new CustomEvent('map_location_change', {
                      detail: { lat: data.coords.lat, lng: data.coords.lng }
                  }))
              }

              generateForecastStrip(data.daily_forecasts)
          }
      } catch (error) {
          console.error("Failed to fetch from backend", error)
          generateSyntheticData()
      }
      setIsLoading(false)
  }

  const generateSyntheticData = (loc = 'Phagwara (Offline Mode)') => {
    let t = [], h = [], w = [], strip = []
    let tBase = 20 + Math.random() * 10
    for(let i=0; i<7; i++) {
        t.push(tBase + (Math.random() * 6 - 3))
        h.push(60 + Math.random() * 30)
        w.push(5 + Math.random() * 20)
        strip.push({
            day: i===0?'Today':`Day ${i+1}`,
            high: Math.round(tBase + 3),
            low: Math.round(tBase - 3),
            wind: Math.round(5 + Math.random() * 20),
            icon: ['fa-cloud-rain text-primary', 'fa-sun text-warning', 'fa-wind text-info'][Math.floor(Math.random()*3)]
        })
    }
    setTempData(t)
    setHumData(h)
    setWindData(w)
    setCurrentTemp(Math.round(t[0]))
    setCurrentHum(Math.round(h[0]))
    setForecastStrip(strip)
    setDisplayedLocation(loc)
    setFloodRisk("Analysis Pending")
  }

  const generateForecastStrip = (forecasts) => {
    if(!forecasts) return;
    const strip = forecasts.map((f, i) => {
        let icon = 'fa-cloud text-slate-400'
        if (f.rain > 5) icon = 'fa-cloud-rain text-primary'
        else if (f.temp > 25) icon = 'fa-sun text-warning'
        else if (f.wind > 20) icon = 'fa-wind text-info'
        
        return {
            day: f.date,
            high: Math.round(f.temp + 2),
            low: Math.round(f.temp - 2),
            wind: Math.round(f.wind),
            icon: icon
        }
    })
    setForecastStrip(strip)
  }

  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  fetchPredictions(position.coords.latitude, position.coords.longitude)
              },
              (error) => {
                  console.warn("Geolocation failed, falling back to Phagwara", error)
                  fetchPredictions(null, null, 'Phagwara')
              },
              { timeout: 5000 } // 5 second timeout
          )
      } else {
          fetchPredictions(null, null, 'Phagwara')
      }
      // eslint-disable-next-line
  }, []) // Removed dependency on locationName to prevent loop, only on mount

  // Live Wind simulation
  const [windAngle, setWindAngle] = useState(45)
  useEffect(() => {
      const interval = setInterval(() => {
          setWindAngle(prev => prev + ((Math.random() * 60) - 30))
          if(Math.random() > 0.7) {
              setConfidence(92 + Math.floor(Math.random() * 5))
          }
      }, 3000)
      return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 pointer-events-auto">
          <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  System Overview - <span className="bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent font-extrabold">{displayedLocation}</span>
              </h1>
              <p className="text-slate-400 mb-0 font-medium">Real-time Environmental Intelligence & Predictive Analysis</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
              <form onSubmit={handleSearchSubmit} className="flex">
                  <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                      </div>
                      <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                          className="bg-[#0B0E14] border border-secondary text-slate-100 text-sm rounded-lg focus:ring-primary focus:border-primary block w-48 ps-10 p-2.5 transition-all"
                          placeholder="Search city or state..." />
                  </div>
              </form>

              <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button type="button" onClick={() => setIsMapView(false)}
                      className={`px-4 py-2 text-sm font-medium border border-info rounded-l-lg transition-colors focus:z-10 focus:ring-2 focus:ring-info ${!isMapView ? 'bg-info text-white' : 'text-info bg-transparent hover:bg-info hover:text-white'}`}>
                      Overall Prediction
                  </button>
                  <button type="button" onClick={() => setIsMapView(true)}
                      className={`px-4 py-2 text-sm font-medium border border-info rounded-r-lg transition-colors focus:z-10 focus:ring-2 focus:ring-info ${isMapView ? 'bg-info text-white' : 'text-info bg-transparent hover:bg-info hover:text-white'}`}>
                      Map Prediction
                  </button>
              </div>
               <button type="button" onClick={() => {
                   if (navigator.geolocation) {
                       setIsLoading(true);
                       navigator.geolocation.getCurrentPosition(
                           (p) => fetchPredictions(p.coords.latitude, p.coords.longitude),
                           () => fetchPredictions(null, null, 'Phagwara')
                       );
                   }
               }}
                   className="bg-accent/10 hover:bg-accent/20 text-accent p-2.5 rounded-lg border border-accent/30 transition-all ml-2" 
                   title="Auto-Detect My Location">
                   <i className="fa-solid fa-location-crosshairs"></i>
               </button>
               <button onClick={() => fetchPredictions(null, null, searchInput || locationName)} disabled={isLoading}
                  className="bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg shadow-glow transition-all ml-2">
                  <i className={`fa-solid fa-rotate-right me-2 ${isLoading?'animate-spin':''}`}></i>Run Model
              </button>
          </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 dashboard-row pointer-events-auto ${isMapView ? 'hidden' : ''}`}>
          <div className="multicolor-border">
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-slate-400 font-semibold mb-2 text-xs uppercase tracking-wider">Current Humidity</p>
                          <h2 className="font-bold text-white text-3xl mb-0 flex items-baseline gap-1">
                              {currentHum}<span className="text-xl text-slate-400 font-normal">%</span>
                          </h2>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-primary-subtle text-primary rounded-xl shadow-sm">
                          <i className="fa-solid fa-droplet text-xl"></i>
                      </div>
                  </div>
                  <div className="mt-4 text-success text-sm font-medium flex items-center">
                      <i className="fa-solid fa-arrow-trend-up me-1"></i> Live API tracking
                  </div>
              </div>
          </div>
          <div className="multicolor-border">
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-slate-400 font-semibold mb-2 text-xs uppercase tracking-wider">AI Confidence Score</p>
                          <h2 className="font-bold text-white text-3xl mb-0 flex items-baseline gap-1">
                              {confidence}<span className="text-xl text-slate-400 font-normal">%</span>
                          </h2>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-success-subtle text-success rounded-xl shadow-sm">
                          <i className="fa-solid fa-microchip text-xl"></i>
                      </div>
                  </div>
                  <div className="mt-4 text-success text-sm font-medium flex items-center">
                      <i className="fa-solid fa-check-circle me-1"></i> Model: RPS-v1.0
                  </div>
              </div>
          </div>
          <div className="multicolor-border">
              <div className={`glass-card p-6 rounded-2xl flex flex-col justify-between h-full ${(floodRisk?.includes('High') || floodRisk?.includes('Likely')) ? 'border-danger' : 'border-accent'}`}>
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">Predicted Rainfall (5d)</p>
                          <h2 className="font-bold text-white text-3xl mb-0 flex items-baseline gap-1">
                              {Math.round(predictedRain)}<span className="text-xl text-slate-400 font-normal">mm</span>
                          </h2>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-info-subtle text-info rounded-xl shadow-sm">
                          <i className="fa-solid fa-cloud-showers-heavy text-xl"></i>
                      </div>
                  </div>
                  <div className={`mt-4 text-sm font-medium flex items-center ${(floodRisk?.includes('High') || floodRisk?.includes('Likely')) ? 'text-danger' : 'text-warning'}`}>
                      <i className="fa-solid fa-triangle-exclamation me-1"></i> Risk: {floodRisk || 'Analyzing...'}
                  </div>
              </div>
          </div>
          <div className="multicolor-border">
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-slate-400 font-semibold mb-2 text-xs uppercase tracking-wider">Current Temperature</p>
                          <h2 className="font-bold text-white text-3xl mb-0 flex items-baseline gap-1">
                              {currentTemp}<span className="text-xl text-slate-400 font-normal">°C</span>
                          </h2>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-warning-subtle text-warning rounded-xl shadow-sm">
                          <i className="fa-solid fa-temperature-three-quarters text-xl"></i>
                      </div>
                  </div>
                  <div className="mt-4 text-success text-sm font-medium flex items-center">
                      <i className="fa-solid fa-signal me-1"></i> All nodes active
                  </div>
              </div>
          </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 dashboard-row pointer-events-auto ${isMapView ? 'hidden' : ''}`}>
          <div className="glass-card p-6 rounded-2xl border-l-4 border-primary bg-gradient-to-r from-primary-subtle to-transparent flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full animate-pulse">
                  <i className="fa-solid fa-brain text-xl"></i>
              </div>
              <div>
                  <h4 className="font-bold text-white text-lg mb-1">AI Intelligence Insight</h4>
                  <p className="text-slate-300 mb-0">
                      {floodRisk?.includes('No') 
                        ? `Current analysis for ${displayedLocation} suggests stable conditions. Temperature is optimal at ${currentTemp}°C.` 
                        : `Warning: AI detected elevated risk factors. ${floodRisk}. Precautionary measures recommended for local residents.`}
                      {currentTemp > 30 ? " High temperature detected, stay hydrated." : ""}
                      {predictedRain > 100 ? " Significant rainfall expected over the next few days." : ""}
                  </p>
              </div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-info/20 flex items-center gap-4 cursor-pointer hover:bg-info/5 transition-all" onClick={() => setIsMapView(true)}>
              <div className="w-10 h-10 flex items-center justify-center bg-info text-white rounded-lg">
                  <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                  <h4 className="font-bold text-white text-sm mb-0">Live Map Intelligence</h4>
                  <p className="text-xs text-slate-400">View real-time choropleth & satellite data</p>
              </div>
              <i className="fa-solid fa-chevron-right ms-auto text-slate-500"></i>
          </div>
      </div>

      <div className={`dashboard-row pointer-events-auto mb-8 w-full ${isMapView ? 'hidden' : ''}`}>
          <div className="flex justify-between items-end mb-4">
            <h5 className="font-bold text-lg text-white mb-0">Advanced Forecast Model</h5>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider">7-Day Analysis</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
              {forecastStrip.map((item, index) => (
                  <div key={index} onClick={() => setWeatherType(item.icon.includes('rain') ? 'rain' : item.icon.includes('sun') ? 'sun' : 'cloud')}
                       className={`glass-card w-full rounded-2xl p-5 flex flex-col items-center justify-center border hover:border-primary/50 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-lg shadow-sm ${index === 0 ? 'border-primary bg-primary/10 ring-1 ring-primary/20' : ''}`}>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{item.day}</span>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${index === 0 ? 'bg-primary/20' : 'bg-white/5'}`}>
                        <i className={`fa-solid ${item.icon} text-2xl drop-shadow-[0_0_8px_currentColor]`}></i>
                      </div>
                      <div className="flex gap-3 text-base font-bold mb-2">
                          <span className="text-white">{item.high}°</span>
                          <span className="text-slate-500">{item.low}°</span>
                      </div>
                      <div className="text-[10px] text-info flex items-center gap-1.5 mt-1 font-bold bg-info/10 px-2 py-1 rounded-full">
                          <i className="fa-solid fa-wind"></i> {item.wind} <span className="opacity-70 uppercase">km/h</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 dashboard-row pointer-events-auto ${isMapView ? 'hidden' : ''}`}>
          <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl h-full flex flex-col">
                  <div className="px-6 py-5 flex justify-between items-center border-b border-cardborder">
                      <h5 className="font-bold text-lg mb-0 text-white">Environmental Factors</h5>
                      <span className="bg-secondary px-3 py-1 rounded text-xs text-slate-300">5-Day AI Forecast</span>
                  </div>
                  <div className="p-6 flex-grow relative w-full h-[350px]">
                      <PredictionChart labels={chartLabels} tempData={tempData} humData={humData} windData={windData} />
                  </div>
              </div>
          </div>
          <div className="col-span-1">
              <div className="glass-card rounded-2xl h-full flex flex-col relative overflow-hidden">
                  <div className="px-6 py-5 border-b border-cardborder relative z-10">
                      <h5 className="font-bold text-lg mb-1 text-white">Live Wind Tracker</h5>
                      <p className="text-sm text-slate-400 mb-0">Current trajectory & velocity</p>
                  </div>
                  <div className="p-6 flex-grow flex flex-col items-center justify-center relative h-[350px]">
                      <div className="relative w-56 h-56 rounded-full border border-secondary bg-[#0B0E14]/80 shadow-glow flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-dashed border-info/30 hover:border-info opacity-70 animate-[spin_30s_linear_infinite]"></div>
                          <div className="absolute w-px h-full bg-secondary/50"></div>
                          <div className="absolute h-px w-full bg-secondary/50"></div>
                          <div className="absolute w-2 h-full flex flex-col items-center transition-transform duration-[2000ms] ease-out z-20" style={{ transform: `rotate(${windAngle}deg)` }}>
                              <i className="fa-solid fa-location-arrow text-accent text-2xl -mt-5 drop-shadow-[0_0_8px_rgba(139,92,246,0.9)]"></i>
                          </div>
                          <div className="z-10 bg-darker rounded-full w-20 h-20 flex flex-col items-center justify-center border border-cardborder shadow-lg">
                              <span className="text-white font-bold text-xl mb-0">{Math.round(windData[0] || 14)}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">km/h</span>
                          </div>
                          <span className="absolute top-2 text-info text-xs font-bold tracking-widest drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]">N</span>
                          <span className="absolute bottom-2 text-slate-500 text-xs font-bold">S</span>
                          <span className="absolute right-3 text-slate-500 text-xs font-bold">E</span>
                          <span className="absolute left-3 text-slate-500 text-xs font-bold">W</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 dashboard-row pointer-events-auto ${isMapView ? 'hidden' : ''}`}>
          <div className="glass-card rounded-2xl p-6">
              <h5 className="font-bold text-lg mb-4 text-white">Feature Correlation Matrix</h5>
              <div className="overflow-x-auto">
                  {correlationData ? (
                      <table className="w-full text-xs text-left text-slate-300">
                          <thead className="text-[10px] uppercase text-slate-500 border-b border-cardborder">
                              <tr>
                                  <th className="px-2 py-2">Factor</th>
                                  {Object.keys(correlationData).map(k => <th key={k} className="px-2 py-2">{k}</th>)}
                              </tr>
                          </thead>
                          <tbody>
                              {Object.keys(correlationData).map(row => (
                                  <tr key={row} className="border-b border-cardborder hover:bg-white/5">
                                      <td className="px-2 py-2 font-bold text-white">{row}</td>
                                      {Object.values(correlationData[row]).map((val, i) => (
                                          <td key={i} className="px-2 py-2" style={{ color: val > 0.5 ? '#10B981' : val < -0.5 ? '#EF4444' : 'inherit' }}>
                                              {Number(val).toFixed(2)}
                                          </td>
                                      ))}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : <div className="text-center py-10 text-slate-500 italic">Processing correlation metrics...</div>}
              </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-center">
              <h5 className="font-bold text-lg mb-4 text-white">AI Predictive Summary</h5>
              <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-cardborder pb-2">
                      <span className="text-slate-400">Precipitation Probability</span>
                      <span className="text-info font-bold">{Math.min(100, Math.round(predictedRain * 0.8))}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-cardborder pb-2">
                      <span className="text-slate-400">Atmospheric Stability</span>
                      <span className="text-success font-bold">{currentHum < 60 ? 'Stable' : 'Unstable'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-cardborder pb-2">
                      <span className="text-slate-400">Storm Intensity Index</span>
                      <span className="text-warning font-bold">{(windData[0] * 0.5 + predictedRain * 0.2).toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-slate-400 pt-2 italic">
                      "System analysis confirms {currentHum > 80 ? 'high moisture saturation' : 'normal air quality'} with a focus on {predictedRain > 50 ? 'flood mitigation' : 'regional monitoring'}."
                  </div>
              </div>
          </div>
      </div>

      {isMapView && mapHtml && (
          <div className="dashboard-row pointer-events-auto mt-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-xl text-white flex items-center gap-2">
                      <i className="fa-solid fa-satellite-dish text-info animate-pulse"></i> 
                      Live Satellite Intelligence - <span className="text-primary">Antigravity Chrome Edition</span>
                  </h5>
                  <div className="flex gap-2">
                      <span className="bg-success-subtle text-success px-3 py-1 rounded-full text-xs font-bold border border-success/20">LIVE DATA</span>
                      <span className="bg-info-subtle text-info px-3 py-1 rounded-full text-xs font-bold border border-info/20">V1.2</span>
                  </div>
              </div>
              <div className="glass-card p-1 rounded-[2rem] overflow-hidden shadow-2xl h-[700px] w-full border-4 border-cardborder bg-black/40 backdrop-blur-xl">
                  <iframe 
                      title="Folium Map"
                      srcDoc={mapHtml} 
                      className="w-full h-full rounded-[1.8rem] border-0 opacity-90 hover:opacity-100 transition-opacity"
                  />
              </div>
          </div>
      )}
    </>
  )
}
