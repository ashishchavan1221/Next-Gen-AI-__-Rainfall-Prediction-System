import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function TopNav({ toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, title: 'High Rainfall Alert', time: '2 mins ago', type: 'danger', icon: 'fa-cloud-showers-heavy' },
    { id: 2, title: 'System Updated', time: '1 hour ago', type: 'success', icon: 'fa-circle-check' },
    { id: 3, title: 'New Forecast Available', time: '5 hours ago', type: 'primary', icon: 'fa-chart-line' },
  ]

  return (
    <nav className="navbar px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">Systems Nominal</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-colors ${showNotifications ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
          >
              <i className="fa-solid fa-bell text-xl"></i>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-[#0B0E14]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h4 className="font-bold text-white">Notifications</h4>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">3 New</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${notif.type}/10 text-${notif.type}`}>
                        <i className={`fa-solid ${notif.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{notif.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{notif.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-white/5">
                <button className="text-xs font-bold text-primary hover:text-blue-400 transition-colors uppercase tracking-widest">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-4 border-l border-cardborder cursor-pointer group"
          >
              <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">RPS Admin</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Advanced Agent</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  AI
              </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-sm font-bold text-white">admin@rps-system.ai</p>
              </div>
              <div className="p-2">
                <Link to="/settings" className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-3" onClick={() => setShowProfile(false)}>
                  <i className="fa-solid fa-user-gear w-5 text-primary"></i>
                  Profile Settings
                </Link>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-3">
                  <i className="fa-solid fa-database w-5 text-warning"></i>
                  Data Management
                </button>
              </div>
              <div className="p-2 border-t border-white/5">
                <button className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors flex items-center gap-3">
                  <i className="fa-solid fa-right-from-bracket w-5"></i>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
