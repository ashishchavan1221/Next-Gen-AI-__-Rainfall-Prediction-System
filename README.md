# Rainfall Prediction System | NexGen AI

A production-ready Rainfall Prediction System built with **React (Vite)** and **FastAPI**. This system analyzes weather data from OpenWeather to provide real-time flood risk assessments and interactive satellite data visualization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python 3.9+

### Local Development

1. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies:**
   ```bash
   pip install -r api/requirements.txt
   ```

3. **Run Development Server:**
   ```bash
   # Start the React frontend (Vite)
   npm run dev

   # Start the FastAPI backend (in a separate terminal)
   uvicorn api.index:app --reload
   ```

## 🌐 Deployment (Vercel)

This project is optimized for deployment on **Vercel**.

1. **Push to GitHub**: Push your code to a new repository.
2. **Import to Vercel**: Connect your repo at [vercel.com](https://vercel.com).
3. **Environment Variables**: Add `OPENWEATHER_API_KEY` in the Vercel project settings.
4. **Deploy**: Vercel will automatically handle the build process for both the React frontend and the Python API.

## 📁 Project Structure

- `api/`: FastAPI backend and serverless functions.
- `src/`: React frontend source code.
- `research/`: Original notebooks and data analysis scripts.
- `vercel.json`: Deployment and routing configuration.

## 🛠 Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Chart.js, Leaflet.
- **Backend**: FastAPI, Pandas, Requests, Folium.
- **Deployment**: Vercel.

---
Built with ❤️ by Antigravity AI
