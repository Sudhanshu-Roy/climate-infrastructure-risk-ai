import React, { useState } from "react";
import "./App.css";

function getRiskClass(category) {
  if (!category) return "low";
  const c = category.toLowerCase();
  if (c.includes("high")) return "high";
  if (c.includes("med")) return "medium";
  return "low";
}

function App() {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    structure_age: "",
    load_index: "",
    soil_moisture: ""
  });

  const [result, setResult] = useState(null);
  const [weatherLoaded, setWeatherLoaded] = useState(false);
  const [loading, setLoading] = useState({ weather: false, analyze: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchWeather = async () => {
    setLoading(l => ({ ...l, weather: true }));
    try {
      const response = await fetch("http://127.0.0.1:8000/fetch-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude)
        })
      });
      const data = await response.json();
      setFormData(f => ({ ...f, temperature: data.temperature, humidity: data.humidity }));
      setWeatherLoaded(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(l => ({ ...l, weather: false }));
  };

  const analyzeRisk = async () => {
    setLoading(l => ({ ...l, analyze: true }));
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rainfall: Number(formData.rainfall),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          structure_age: Number(formData.structure_age),
          load_index: Number(formData.load_index),
          soil_moisture: Number(formData.soil_moisture)
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(l => ({ ...l, analyze: false }));
  };

  const riskClass = result ? getRiskClass(result.risk_category) : "low";
  const probPct = result ? (result.risk_probability * 100).toFixed(1) : 0;
  const sortedFeatures = result
    ? Object.entries(result.feature_importance).sort((a, b) => b[1] - a[1])
    : [];
  const maxFeatureVal = sortedFeatures.length ? sortedFeatures[0][1] : 1;

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-eyebrow">CI-IVA System</div>
        <h1>Climate-Integrated Infrastructure<br />Vulnerability Assessment</h1>
        <div className="header-sub">Real-time structural risk analysis powered by environmental data</div>
      </div>

      {/* Location Card */}
      <div className="card">
        <div className="section-label"><span className="icon"></span> Geolocation</div>

        <div className="input-grid">
          <div className="field">
            <label>Latitude</label>
            <input type="number" name="latitude" placeholder="e.g. 28.6139" value={formData.latitude} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Longitude</label>
            <input type="number" name="longitude" placeholder="e.g. 77.2090" value={formData.longitude} onChange={handleChange} />
          </div>
        </div>

        {(formData.latitude || formData.longitude) && (
          <div className="coord-display">
            <div className={`coord-chip ${formData.latitude ? "active" : ""}`}>
              LAT {formData.latitude || "—"}
            </div>
            <div className={`coord-chip ${formData.longitude ? "active" : ""}`}>
              LNG {formData.longitude || "—"}
            </div>
          </div>
        )}

        <button className="btn btn-secondary" onClick={fetchWeather} style={{ marginTop: 16 }}>
          {loading.weather ? "Fetching…" : "⟳ Auto-fetch Weather Data"}
        </button>

        <div className="divider" />

        {/* Environmental Inputs */}
        <div className="section-label"><span className="icon"></span> Environmental Inputs</div>

        {weatherLoaded && (
          <div className="status-bar">
            <div className="dot" />
            Weather data loaded from API
          </div>
        )}

        <div className="input-grid three-col">
          <div className="field">
            <label>Rainfall (mm)</label>
            <input type="number" name="rainfall" placeholder="0.0" value={formData.rainfall} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Temperature (°C)</label>
            <input type="number" name="temperature" placeholder="0.0" value={formData.temperature} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Humidity (%)</label>
            <input type="number" name="humidity" placeholder="0.0" value={formData.humidity} onChange={handleChange} />
          </div>
        </div>

        <div className="divider" />

        {/* Structural Inputs */}
        <div className="section-label"><span className="icon"></span> Structural Parameters</div>

        <div className="input-grid three-col">
          <div className="field">
            <label>Structure Age (yr)</label>
            <input type="number" name="structure_age" placeholder="0" value={formData.structure_age} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Load Index</label>
            <input type="number" name="load_index" placeholder="0.0" value={formData.load_index} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Soil Moisture (%)</label>
            <input type="number" name="soil_moisture" placeholder="0.0" value={formData.soil_moisture} onChange={handleChange} />
          </div>
        </div>

        <button className="btn btn-primary" onClick={analyzeRisk} style={{ marginTop: 8 }}>
          {loading.analyze ? "Analyzing…" : "▶ Run Vulnerability Analysis"}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="card result-card">
          <div className="section-label"><span className="icon"></span> Assessment Results</div>

          <div className="risk-header">
            <div>
              <div className="risk-prob">
                {probPct}<span>%</span>
              </div>
              <div className="prob-label">Risk Probability</div>
            </div>
            <div className={`risk-badge ${riskClass}`}>
              {result.risk_category}
            </div>
          </div>

          <div className="progress-track">
            <div
              className={`progress-fill ${riskClass}`}
              style={{ width: `${probPct}%` }}
            />
          </div>

          <div className="action-box">
            <div className="action-label">Recommended Action</div>
            {result.recommended_action}
          </div>

          <div className="section-label" style={{ marginTop: 8 }}><span className="icon"></span> Feature Importance</div>

          <div className="features-grid">
            {sortedFeatures.map(([key, value]) => (
              <div className="feature-row" key={key}>
                <div className="feature-name">{key.replace(/_/g, " ")}</div>
                <div className="feature-bar-track">
                  <div
                    className="feature-bar-fill"
                    style={{ width: `${(value / maxFeatureVal) * 100}%` }}
                  />
                </div>
                <div className="feature-pct">{(value * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
