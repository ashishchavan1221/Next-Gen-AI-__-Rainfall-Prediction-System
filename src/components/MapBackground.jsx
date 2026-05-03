import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Component to handle map flying when coordinates change
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 })
  }, [center, zoom, map])
  return null
}

// Global hook to resize when map toggle visibility
function MapResizer({ isMapView }) {
    const map = useMap()
    useEffect(() => {
      if (isMapView) {
          setTimeout(() => map.invalidateSize(), 400)
      }
    }, [isMapView, map])
    return null
}

export default function MapBackground({ isMapView }) {
  // Expose an event listener or context to move the map.
  // For simplicity we will listen to a custom window event for map location changes.
  const [center, setCenter] = useState([40.7128, -74.0060])
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const handleLocationChange = (e) => {
        const { lat, lng } = e.detail
        setCenter([lat, lng])
        // Generate new random hotspots around the new center
        let newM = []
        for (let i = 0; i < 3; i++) {
            let offsetLat = (Math.random() - 0.5) * 2;
            let offsetLng = (Math.random() - 0.5) * 2;
            let theme = [
                { color: 'rgba(59, 130, 246, 0.5)', hex: '#3B82F6' },
                { color: 'rgba(6, 182, 212, 0.5)', hex: '#06B6D4' },
                { color: 'rgba(139, 92, 246, 0.5)', hex: '#8B5CF6' }
            ][Math.floor(Math.random() * 3)];
            
            newM.push({
                pos: [lat + offsetLat, lng + offsetLng],
                color: theme.color,
                fillColor: theme.hex,
                radius: 40000 + (Math.random() * 20000)
            })
        }
        setMarkers(newM)
    }

    // initialize first markers
    handleLocationChange({ detail: { lat: 40.7128, lng: -74.0060 } })
    
    window.addEventListener('map_location_change', handleLocationChange)
    return () => window.removeEventListener('map_location_change', handleLocationChange)
  }, [])

  return (
    <div id="map-background" className={isMapView ? 'active-map' : ''}>
      <MapContainer 
        center={center} 
        zoom={6} 
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController center={center} zoom={6} />
        <MapResizer isMapView={isMapView} />
        <TileLayer
          maxZoom={19}
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m, idx) => (
            <Circle 
                key={idx} 
                center={m.pos} 
                pathOptions={{ color: m.color, fillColor: m.fillColor, fillOpacity: 0.3 }} 
                radius={m.radius} 
            />
        ))}
      </MapContainer>
    </div>
  )
}
