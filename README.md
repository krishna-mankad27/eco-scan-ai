Eco-Scan AI
An interactive, AI-powered map dashboard designed to track industrial air pollution and give people clear, immediate safety advice. Built specifically with the Sahibabad Industrial Area (and the IPEC Campus) in mind.

Why We Built This
Most weather apps just show you a generic AQI number. But telling a resident or a student that PM2.5 is at 150 mg/m³ doesn't help them figure out what to do next. On top of that, official sensors are miles apart and completely miss hyper-local pollution spikes caused by factories releasing smoke unexpectedly.

Eco-Scan AI fixes this in three ways:

Interactive Tracking: It maps real-time pollution data directly onto a local map layer.

AI Action Plans: It uses Google Gemini to translate raw chemical data into clear, human-centric health protocols (like advising deep-lung protection for particulates versus sealing windows for gas leaks).

Crowdsourced Reports: If a user spots a factory illegally releasing smoke, they can click the map to drop a warning pin and instantly alert other users, earning Green Credits for helping the community.

The Tech Stack
Frontend: React 19 + Vite (Keeps the app fast and responsive on mobile)
Map Layer: Leaflet & React-Leaflet (Handles geographic coordinates and custom hazard circles)
Weather Data: OpenWeather Air Pollution API (Tracks PM2.5, PM10, NO2, SO2, CO, and O3)
AI Core: Google Gemini 1.5 Flash SDK (Acts as our digital toxicologist for instant advice)
