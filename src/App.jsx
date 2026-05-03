import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './components/Dashboard'
import ModelsPage from './pages/ModelsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import WeatherOverlay from './components/WeatherOverlay'
import MapBackground from './components/MapBackground'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMapView, setIsMapView] = useState(false)
  const [weatherType, setWeatherType] = useState('rain')
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-weather', weatherType)
    localStorage.setItem('theme', theme)
  }, [theme, weatherType])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <BrowserRouter>
      <MapBackground isMapView={isMapView} />
      <WeatherOverlay type={weatherType} />

      <div className="flex" id="wrapper">
        <Sidebar isOpen={sidebarOpen} />
        
        <div id="page-content-wrapper" className="flex-grow w-full md:ml-64 min-h-screen">
          <TopNav toggleSidebar={toggleSidebar} />
          
          <main className="p-6 md:p-8 main-content z-10 relative w-full pointer-events-auto">
            <Routes>
              <Route path="/" element={
                  <Dashboard 
                     isMapView={isMapView} 
                     setIsMapView={setIsMapView}
                     setWeatherType={setWeatherType}
                  />
              } />
              <Route path="/models" element={<ModelsPage />} />
              <Route path="/maps" element={
                  <Dashboard 
                     isMapView={true} 
                     setIsMapView={setIsMapView}
                     setWeatherType={setWeatherType}
                  />
              } />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
