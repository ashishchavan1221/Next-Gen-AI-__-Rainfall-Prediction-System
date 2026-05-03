from fastapi import FastAPI, HTTPException
import requests
import pandas as pd
import numpy as np
import os
from datetime import datetime
import folium
from folium.plugins import HeatMap
from typing import Optional

app = FastAPI()

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.environ.get("OPENWEATHER_API_KEY", "")
if not API_KEY:
    print("WARNING: OPENWEATHER_API_KEY not set. Create a .env file in the api/ directory with: OPENWEATHER_API_KEY=your_key_here")

def fetch_weather_data(city: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None):
    if lat is not None and lon is not None:
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={API_KEY}"
    else:
        # If city is empty or just whitespace, default to Phagwara
        search_city = city.strip() if city and city.strip() else "Phagwara"
        url = f"https://api.openweathermap.org/data/2.5/forecast?q={search_city}&units=metric&appid={API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch weather data")
    return response.json()

def process_data_and_predict(data):
    forecast_list = data.get("list", [])
    
    records = []
    
    for item in forecast_list:
        dt_txt = item.get("dt_txt")
        # Temperature is already in Celsius due to units=metric in API call
        temp = item["main"].get("temp")
        humidity = item["main"].get("humidity")
        wind = item["wind"].get("speed") * 3.6 # convert m/s to km/h
        
        # openweather represents rain as a dict: {'3h': volume}
        # Multiply by 10 for scaling accuracy as per new notebook
        rain_3h = item.get("rain", {}).get("3h", 0) * 10
        
        date_str = dt_txt.split(" ")[0]
        
        records.append({
            "Time": dt_txt,
            "Date": date_str,
            "Temperature": temp,
            "Humidity": humidity,
            "Wind Speed": wind,
            "Rain value(mm)": rain_3h
        })
        
    df = pd.DataFrame(records)
    
    if df.empty:
        return None
    
    # Calculate daily aggregates
    daily_df = df.groupby('Date').agg({
        'Temperature': 'mean',
        'Humidity': 'mean',
        'Wind Speed': 'mean',
        'Rain value(mm)': 'sum'
    }).reset_index()
    
    # Calculate overall values over 5 days
    total_rain = daily_df['Rain value(mm)'].sum()
    avg_humidity = daily_df['Humidity'].mean()
    avg_temp = daily_df['Temperature'].mean()
    
    # Application of Notebook Logic for Flood Prediction per day
    flood_risk = "No Flood"
    risk_levels = {"High Risk Flood": 3, "Flood Likely Happened": 2, "No Flood": 1}
    max_risk = 1

    for _, row in daily_df.iterrows():
        rain = row['Rain value(mm)']
        hum = row['Humidity']
        temp = row['Temperature']
        if rain > 200 and hum > 90 and temp < 20:
            current_risk = "High Risk Flood"
        elif rain >= 50 and hum > 85:
            current_risk = "Flood Likely Happened"
        else:
            current_risk = "No Flood"
            
        if risk_levels[current_risk] > max_risk:
            max_risk = risk_levels[current_risk]
            flood_risk = current_risk
        
    # Formatting for frontend
    daily_forecasts = []
    for _, row in daily_df.iterrows():
        # format date snippet (e.g. "Mon")
        try:
            day_name = datetime.strptime(row['Date'], '%Y-%m-%d').strftime('%a')
        except:
            day_name = row['Date']
            
        daily_forecasts.append({
            "date": day_name,
            "full_date": row['Date'],
            "temp": round(row['Temperature'], 1),
            "humidity": round(row['Humidity'], 1),
            "wind": round(row['Wind Speed'], 1),
            "rain": round(row['Rain value(mm)'], 1)
        })
        
    # current exact values (use first record)
    current = {
        "temp": round(records[0]["Temperature"], 1),
        "humidity": round(records[0]["Humidity"], 1),
        "wind": round(records[0]["Wind Speed"], 1),
        "rain": round(total_rain, 1) # showing 5d rain total for the KPI
    }

    coords = data.get("city", {}).get("coord", {"lat": 0, "lon": 0})
    city_name = data.get("city", {}).get("name", "Unknown Location")
    country = data.get("city", {}).get("country", "")
    full_location = f"{city_name}, {country}" if country else city_name
    
    # Generate Map HTML
    m = folium.Map(location=[coords["lat"], coords["lon"]], zoom_start=10)
    folium.TileLayer(
        tiles=f"https://maps.openweathermap.org/maps/2.0/weather/1h/PA0/{{z}}/{{x}}/{{y}}?appid={API_KEY}",
        attr="OpenWeatherMap Precipitation",
        name="Precipitation (Choropleth/Tile)",
        overlay=True
    ).add_to(m)
    folium.TileLayer(
        tiles=f"https://maps.openweathermap.org/maps/2.0/weather/1h/TA2/{{z}}/{{x}}/{{y}}?appid={API_KEY}",
        attr="OpenWeatherMap Temperature",
        name="Temperature",
        overlay=True
    ).add_to(m)
    # Add a data-driven "Choropleth" style Risk Zone circle
    risk_color = "green"
    if flood_risk == "High Risk Flood": risk_color = "red"
    elif flood_risk == "Flood Likely Happened": risk_color = "orange"
    
    # Simple data for Choropleth (the current location)
    if country:
        # We can use a remote geojson for the choropleth
        geojson_url = 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/world-countries.json'
        folium.Choropleth(
            geo_data=geojson_url,
            name="Global Precipitation Risk",
            data=pd.DataFrame({'Country': [country], 'Rain': [total_rain]}),
            columns=['Country', 'Rain'],
            key_on='feature.id',
            fill_color='YlGnBu',
            fill_opacity=0.3,
            line_opacity=0.2,
            legend_name='Total Predicted Rainfall (mm)'
        ).add_to(m)

    folium.Circle(
        location=[coords["lat"], coords["lon"]],
        radius=5000, # 5km radius
        color=risk_color,
        fill=True,
        fill_color=risk_color,
        fill_opacity=0.4,
        popup=f"Flood Risk Level: {flood_risk}"
    ).add_to(m)

    folium.LayerControl().add_to(m)
    map_html = m._repr_html_()
        
    # Convert correlation matrix to standard Python types for JSON serialization
    corr_df = df.drop(columns=['Time', 'Date', 'datetime_obj'], errors='ignore').select_dtypes(include=[np.number]).corr().fillna(0)
    correlation = {k: {ik: float(iv) for ik, iv in v.items()} for k, v in corr_df.to_dict().items()}
        
    return {
        "success": True,
        "location": full_location,
        "flood_risk": flood_risk,
        "current": {
            "temp": float(current["temp"]),
            "humidity": float(current["humidity"]),
            "wind": float(current["wind"]),
            "rain": float(current["rain"]),
            "condition": data.get("list", [{}])[0].get("weather", [{}])[0].get("main", "Clear")
        },
        "daily_forecasts": daily_forecasts,
        "coords": {"lat": float(coords["lat"]), "lng": float(coords["lon"])},
        "map_html": map_html,
        "correlation": correlation
    }

def convert_numpy(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(v) for v in obj]
    elif isinstance(obj, (np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.float64, np.float32, np.float16)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

import json

@app.get("/api/predict")
def predict_endpoint(city: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None):
    try:
        # fetch_weather_data handles empty city by defaulting to Phagwara
        data = fetch_weather_data(city=city, lat=lat, lon=lon)
        result = process_data_and_predict(data)
        if not result:
            raise HTTPException(status_code=500, detail="Weather data processing failed")
        
        # Robust conversion of NumPy types to standard Python types via JSON round-trip
        # This fixes the serialization error for complex nested objects
        cleaned_result = json.loads(json.dumps(result, default=lambda x: x.item() if hasattr(x, 'item') else str(x)))
        return cleaned_result
    except HTTPException as he:
        # Re-raise HTTP exceptions (like 401 Unauthorized) to pass them to the client
        raise he
    except Exception as e:
        # Catch all other unexpected errors
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
