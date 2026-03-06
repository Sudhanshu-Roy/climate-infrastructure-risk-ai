# Climate-Integrated Infrastructure Vulnerability Assessment System (CI-IVAS)

An **AI-assisted decision support system** that evaluates infrastructure vulnerability by combining **structural parameters and environmental conditions**. The system predicts risk probability and recommends inspection actions to help engineers prioritize maintenance and prevent structural failures.

---

## Problem Statement

Infrastructure failures often occur **after visible damage appears**, resulting in economic loss and safety risks. Traditional inspection methods rely heavily on **periodic manual inspections**, which may overlook emerging vulnerabilities caused by environmental stress or structural aging.

With **increasing climate variability and aging infrastructure**, there is a need for an intelligent system that can assist engineers in **prioritizing inspections and identifying potential risks earlier**.

---

## Solution

CI-IVAS integrates **machine learning, environmental data, and structural parameters** to estimate infrastructure vulnerability.

The system:

1. Accepts **structural and environmental inputs**
2. Retrieves **weather data using a climate API**
3. Processes data using a trained **Random Forest model**
4. Calculates **risk probability**
5. Generates a **risk classification and recommended action**

This provides engineers with an **AI-assisted vulnerability assessment tool** rather than a purely automated decision system.

---

## System Architecture

User Input (Structural + Location)
        ↓
Frontend (React Interface)
        ↓
Backend API (FastAPI)
        ↓
Weather API (Open-Meteo)
        ↓
Machine Learning Model (Random Forest)
        ↓
Risk Probability + Recommended Action

---

## Features

- Infrastructure vulnerability prediction using machine learning
- Climate-aware risk analysis
- Hybrid input system (manual structural data + detected environmental data)
- Explainable AI with feature importance
- Risk classification and recommended actions
- Full-stack architecture (React + FastAPI)

---

## Risk Classification Framework

| Probability | Risk Level | Recommended Action |
|------------|-----------|--------------------|
| 0 – 0.30 | Low Risk | Routine monitoring |
| 0.30 – 0.60 | Moderate Risk | Schedule inspection |
| 0.60 – 0.85 | High Risk | Priority inspection |
| 0.85 – 1.00 | Critical Risk | Immediate structural audit |

---

## Tech Stack

### Frontend
- React
- JavaScript
- CSS

### Backend
- FastAPI
- Python
- Pydantic

### Machine Learning
- Scikit-learn
- Random Forest Classifier
- NumPy
- Pandas

### External Data
- Open-Meteo Weather API

---

## Model Performance

The model was optimized to prioritize **recall for high-risk structures**, ensuring potential vulnerabilities are not missed.

| Metric | Value |
|------|------|
| Recall (High Risk Class) | **97%** |
| Precision | **84%** |

This trade-off prioritizes **safety over false alarms**, which is essential in infrastructure risk assessment.

---

## Example Workflow

1. User enters:
   - Location coordinates
   - Structure age
   - Load index
   - Soil moisture
   - Rainfall estimate

2. System fetches:
   - Temperature
   - Humidity

3. Model evaluates vulnerability and outputs:
   - Risk probability
   - Risk category
   - Feature importance
   - Recommended inspection action

---

## Installation

### Clone the repository
 
```
git clone https://github.com/yourusername/climate-infrastructure-risk-ai.git
cd climate-infrastructure-risk-ai
```

---

### Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

Backend runs on:
```
http://127.0.0.1:8000
```


---

### Frontend Setup

```
cd frontend
npm install
npm start
```


Frontend runs on:

```
http://localhost:3000
```


---

## Future Improvements

- Integration with infrastructure asset databases
- Soil dataset integration
- Climate projection modeling
- Satellite-based environmental features
- Risk visualization dashboard
- Cloud deployment for real-time monitoring

---

## Disclaimer

This project is designed as a **decision-support prototype** for infrastructure vulnerability assessment and should not replace professional structural evaluation.

---

## Author

Sudhanshu Roy  
Engineering Student | AI & Data Science Enthusiast
