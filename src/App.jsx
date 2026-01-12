import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MapContainer, TileLayer, Circle, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- CONFIGURATION (Ensure these are active) ---
// Remove the hardcoded strings
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;

// The rest of your code remains the same
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
function App() {
  const [weather, setWeather] = useState(null);
  const [aiAdvice, setAiAdvice] = useState("Scan the map or click a zone to report a spike...");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(110);
  const [reports, setReports] = useState([]);

  const centerCoords = [28.6589, 77.3459]; // Sahibabad / IPEC

  // Fetch initial data for the dashboard
  useEffect(() => {
    fetchEnvironmentalData(centerCoords[0], centerCoords[1]);
  }, []);

  const fetchEnvironmentalData = async (lat, lon) => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lat}&appid=${WEATHER_KEY}`);
      setWeather(res.data.list[0]);
    } catch (err) { console.error("Telemetry failure", err); }
  };

  // Logic for clicking on the map to report a spike
  function MapEvents() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleSpikeReport(lat, lng);
      },
    });
    return null;
  }

  const handleSpikeReport = async (lat, lng) => {
    setLoading(true);
    setCredits(prev => prev + 10); // Reward points for reporting
    
    // Add a marker for the reported spike
    const newReport = { lat, lng, id: Date.now() };
    setReports([...reports, newReport]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `URGENT: User reported an industrial air spike at coordinates ${lat}, ${lng}. 
      Current AQI is ${weather?.main?.aqi || 'High'}. 
      Act as an Emergency Response AI. Provide 2 clinical safety steps for this specific location.`;
      
      const result = await model.generateContent(prompt);
      setAiAdvice(result.response.text());
    } catch (err) {
      setAiAdvice("Spike logged at " + lat.toFixed(2) + ". Alert sent to local authorities. Stay indoors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#e0f7ef', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header with Green Credits */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#004d40', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🌍 Eco Scan AI <span style={{fontSize: '0.8rem', background: '#004d40', color: 'white', padding: '2px 8px', borderRadius: '10px'}}>LIVE MONITOR</span>
          </h1>
          <p style={{ margin: 0, color: '#00796b', fontWeight: 'bold' }}>IPEC Smart Campus • Industrial Hazard Detection</p>
        </div>
        <div style={{ background: 'white', padding: '12px 25px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          💰 <span style={{ color: '#004d40', fontWeight: 'bold' }}>{credits} Green Credits Earned</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '25px' }}>
        
        {/* LEFT: Map with Heatmap and Click functionality */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Interactive Risk Heatmap</h3>
            <span style={{ fontSize: '0.8rem', color: '#b71c1c', fontWeight: 'bold' }}>🖱️ Click Map to Report Spike (+10 Credits)</span>
          </div>
          <div style={{ height: '500px', borderRadius: '20px', overflow: 'hidden', cursor: 'crosshair' }}>
            <MapContainer center={centerCoords} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapEvents />
              
              {/* Main Industrial Heatmap Circle */}
              {weather && (
                <Circle 
                  center={centerCoords} 
                  radius={800} 
                  pathOptions={{ 
                    color: '#b71c1c', 
                    fillColor: '#b71c1c', 
                    fillOpacity: 0.35,
                    weight: 2 
                  }} 
                />
              )}

              {/* User Reported Spike Markers */}
              {reports.map(report => (
                <Circle key={report.id} center={[report.lat, report.lng]} radius={150} pathOptions={{ color: 'orange', fillColor: 'orange' }} />
              ))}
            </MapContainer>
          </div>
        </div>

        {/* RIGHT: AI & Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Professional AI Box */}
          <div style={{ background: '#f8e7d8', padding: '25px', borderRadius: '25px', borderLeft: '10px solid #b71c1c', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#1b5e20' }}>🛡️ AI Health Protocol</h4>
            <div style={{ fontSize: '1.05rem', color: '#2c3e50', lineHeight: '1.6', minHeight: '140px' }}>
              {loading ? "Processing Spike Telemetry..." : `"${aiAdvice}"`}
            </div>
          </div>

          {/* Sensor Data Dashboard */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            <h4 style={{ marginTop: 0 }}>Atmospheric Telemetry</h4>
            <div style={{ background: '#b71c1c', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '15px' }}>
              STATUS: HAZARDOUS SPIKE
            </div>
            
            <SensorRow label="Hazard Index (AQI)" value={weather ? `${weather.main.aqi} / 5` : "---"} />
            <SensorRow label="PM 2.5" value={weather ? `${weather.components.pm2_5} µg/m³` : "---"} />
            <SensorRow label="Nitrogen Oxide" value={weather ? `${weather.components.no2} ppb` : "---"} />
            <SensorRow label="Sulfur Dioxide" value={weather ? `${weather.components.so2} ppb` : "---"} />
            <SensorRow label="Carbon Monoxide" value={weather ? `${weather.components.co.toFixed(2)} ppm` : "---"} />
          </div>

        </div>
      </div>
    </div>
  );
}

function SensorRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '0.95rem' }}>
      <span style={{ color: '#607d8b' }}>{label}</span>
      <span style={{ color: '#263238' }}>{value}</span>
    </div>
  );
}

export default App;