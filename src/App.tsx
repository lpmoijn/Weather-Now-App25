import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Wind } from "lucide-react"; // icons

// Navbar
function Navbar() {
  return (
    <nav className="bg-white/20 backdrop-blur-md text-white px-6 py-3 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">🌤️ WeatherNow</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/forecast" className="hover:underline">
          Forecast
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
      </div>
    </nav>
  );
}

// Weather Card
function WeatherCard({ city, weather }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white/30 backdrop-blur-lg p-6 shadow-xl text-center w-80"
    >
      <h2 className="text-xl font-semibold">{city}</h2>
      <div className="flex justify-center items-center gap-3 mt-2">
        <Sun className="w-10 h-10 text-yellow-400" />
        <p className="text-5xl font-bold">{weather.temperature}°C</p>
      </div>
      <p className="text-gray-100 mt-2 flex items-center justify-center gap-2">
        <Wind className="w-4 h-4" /> {weather.windspeed} km/h
      </p>
      <p className="text-gray-200 text-sm mt-1">
        Last updated: {new Date(weather.time).toLocaleString()}
      </p>
    </motion.div>
  );
}

// Home Page
function Home({
  fetchWeather,
  city,
  setCity,
  cities,
  weather,
  loading,
  error,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-6 text-white drop-shadow">
        Check Current Weather
      </h2>

      <div className="flex gap-2 mb-6">
        <select
          className="rounded-xl border px-3 py-2 bg-white/70 backdrop-blur-md"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">-- Select City --</option>
          {Object.keys(cities).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={fetchWeather}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Get Weather
        </button>
      </div>

      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-300">{error}</p>}
      {weather && <WeatherCard city={city} weather={weather} />}
    </div>
  );
}

// Forecast Page
function Forecast() {
  return (
    <div className="p-6 flex flex-col items-center text-white">
      <h2 className="text-2xl font-bold mb-4">🌦️ 5-Day Forecast</h2>
      <p className="text-gray-200">Coming soon... (extend API here)</p>
    </div>
  );
}

// About Page
function About() {
  return (
    <div className="p-6 flex flex-col items-center text-center text-white">
      <h2 className="text-2xl font-bold mb-4">ℹ️ About This App</h2>
      <p className="max-w-lg text-gray-200">
        WeatherNow is a simple weather application built using React,
        TailwindCSS, Framer Motion, and the Open-Meteo API. It provides
        real-time weather updates with a modern UI.
      </p>
    </div>
  );
}

// Main App
export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = {
    Hyderabad: { lat: 17.385, lon: 78.4867 },
    Delhi: { lat: 28.7041, lon: 77.1025 },
    London: { lat: 51.5072, lon: -0.1276 },
    NewYork: { lat: 40.7128, lon: -74.006 },
  };

  async function fetchWeather() {
    if (!city || !cities[city]) {
      setError("Please select a valid city.");
      return;
    }
    setLoading(true);
    setError("");
    setWeather(null);

    const { lat, lon } = cities[city];
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (e) {
      setError("Failed to load weather.");
    } finally {
      setLoading(false);
    }
  }

  const background =
    weather?.temperature > 30
      ? "from-orange-400 via-yellow-300 to-pink-400"
      : weather?.temperature < 15
      ? "from-blue-800 via-blue-600 to-gray-700"
      : "from-sky-400 via-blue-400 to-indigo-500";

  return (
    <Router>
      <div
        className={`min-h-screen bg-gradient-to-br ${background} flex flex-col`}
      >
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                fetchWeather={fetchWeather}
                city={city}
                setCity={setCity}
                cities={cities}
                weather={weather}
                loading={loading}
                error={error}
              />
            }
          />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
