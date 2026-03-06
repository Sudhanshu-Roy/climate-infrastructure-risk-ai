from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import requests

# Load trained model
model = joblib.load(r"C:\Users\royso\OneDrive\Documents\Infra AI\infrastructure_model.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input schema
from pydantic import BaseModel

class WeatherRequest(BaseModel):
    latitude: float
    longitude: float


class PredictionRequest(BaseModel):
    rainfall: float
    temperature: float
    humidity: float
    structure_age: int
    load_index: float
    soil_moisture: float

@app.get("/")
def home():
    return {"message": "Infrastructure Risk Prediction API is running"}

@app.post("/fetch-weather")
def fetch_weather(data: WeatherRequest):

    lat = data.latitude
    lng = data.longitude

    weather_url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lng}"
        f"&current_weather=true"
        f"&hourly=relativehumidity_2m"
    )

    response = requests.get(weather_url)
    weather_json = response.json()

    temperature = weather_json["current_weather"]["temperature"]
    humidity = weather_json["hourly"]["relativehumidity_2m"][0]

    return {
        "temperature": temperature,
        "humidity": humidity
    }

@app.post("/predict")
def predict(data: PredictionRequest):

    extreme_events = 2  # constant assumption for now

    features = np.array([[
        data.rainfall,
        data.temperature,
        data.humidity,
        data.structure_age,
        data.load_index,
        data.soil_moisture,
        extreme_events
    ]])

    probability = model.predict_proba(features)[0][1]

    if probability < 0.3:
        category = "Low Risk"
        action = "Routine monitoring (annual inspection recommended)"

    elif probability < 0.6:
        category = "Moderate Risk"
        action = "Schedule structural inspection within 3–6 months"

    elif probability < 0.85:
        category = "High Risk"
        action = "Priority inspection required within 30 days"

    else:
        category = "Critical Risk"
        action = "Immediate structural audit required. Consider load restriction."

    feature_names = [
        "rainfall",
        "temperature",
        "humidity",
        "structure_age",
        "load_index",
        "soil_moisture",
        "extreme_events"
    ]

    feature_importance = {
        name: round(float(importance), 3)
        for name, importance in zip(feature_names, model.feature_importances_)
    }

    return {
        "risk_probability": round(float(probability), 3),
        "risk_category": category,
        "recommended_action": action,
        "feature_importance": feature_importance
    }