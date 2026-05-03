import React, { useEffect, useState } from 'react'

export default function WeatherOverlay({ type }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    let count = 0
    let className = ''
    let newParticles = []

    if (type === 'rain') { count = 120; className = 'particle-rain' }
    else if (type === 'wind') { count = 40; className = 'particle-wind' }
    else if (type === 'sun') { count = 3; className = 'particle-sun' }
    else if (type === 'cloud') { count = 8; className = 'particle-cloud' }
    else if (type === 'snow') { count = 100; className = 'particle-snow' }
    else if (type === 'humid') { count = 5; className = 'particle-humid' }

    for (let i = 0; i < count; i++) {
        let style = {}
        if (type === 'rain') {
            style = {
                left: `${Math.random() * 100}vw`,
                top: `-${Math.random() * 20}vh`,
                animationDuration: `${0.4 + Math.random() * 0.3}s`,
                animationDelay: `${Math.random() * 2}s`
            }
        } else if (type === 'wind') {
            style = {
                top: `${Math.random() * 100}vh`,
                left: `-${Math.random() * 20}vw`,
                width: `${100 + Math.random() * 200}px`,
                animationDuration: `${1 + Math.random() * 1.5}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.4 + 0.1
            }
        } else if (type === 'sun') {
            style = {
                top: `${10 + Math.random() * 80}vh`,
                left: `${10 + Math.random() * 80}vw`,
                width: `${300 + Math.random() * 600}px`,
                height: `${300 + Math.random() * 600}px`,
                animationDuration: `${4 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
            }
        } else if (type === 'cloud') {
            style = {
                top: `${Math.random() * 60}vh`,
                left: `-${Math.random() * 100}vw`,
                width: `${400 + Math.random() * 600}px`,
                height: `${200 + Math.random() * 300}px`,
                animationDuration: `${30 + Math.random() * 30}s`,
                animationDelay: `${Math.random() * 10}s`
            }
        } else if (type === 'snow') {
            style = {
                left: `${Math.random() * 100}vw`,
                top: `-${Math.random() * 20}vh`,
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                animationDuration: `${4 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 5}s`
            }
        } else if (type === 'humid') {
            style = {
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                width: `${600 + Math.random() * 600}px`,
                height: `${600 + Math.random() * 600}px`,
                animationDuration: `${8 + Math.random() * 8}s`,
                animationDelay: `${Math.random() * 4}s`
            }
        }
        newParticles.push({ id: i, className, style })
    }
    setParticles(newParticles)
  }, [type])

  return (
    <div id="weather-animations" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        {particles.map(p => (
            <div key={p.id} className={p.className} style={p.style}></div>
        ))}
    </div>
  )
}
