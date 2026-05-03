import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { icon: 'fa-gauge-high', text: 'Dashboard', path: '/' },
    { icon: 'fa-microchip', text: 'Models', path: '/models' },
    { icon: 'fa-map-location-dot', text: 'Maps', path: '/maps' },
    { icon: 'fa-clock-rotate-left', text: 'History', path: '/history' },
    { icon: 'fa-gear', text: 'Settings', path: '/settings' },
  ]

  const activeClass = "flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all bg-primary/10 text-primary border border-primary/20"
  const inactiveClass = "flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all text-slate-400 hover:bg-white/5 hover:text-white"

  return (
    <aside id="sidebar-wrapper" className={`w-64 fixed h-full transition-all duration-300 z-50 ${isOpen ? 'left-0' : '-left-64 md:left-0'}`}>
      <div className="p-6 border-b border-cardborder">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
                  <i className="fa-solid fa-cloud-bolt text-white text-xl"></i>
              </div>
              <h3 className="font-bold text-lg text-white tracking-tight leading-tight">Rainfall Prediction System</h3>
          </div>
      </div>
      <nav className="mt-6 px-4">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({isActive}) => isActive ? activeClass : inactiveClass}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="font-semibold">{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
