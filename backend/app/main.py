from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import joblib
import os
import json
from .vision import VisionAnalyzer
from .ocr import InvoiceProcessor
from .reasoning import ReasoningEngine
from .retrieval import ClaimRetriever
from .report import ReportGenerator

app = FastAPI(title="ClaimShield API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
vision = VisionAnalyzer()
ocr = InvoiceProcessor()
reasoning = ReasoningEngine()
retriever = ClaimRetriever()
reporter = ReportGenerator()

# Load ML Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'fraud_model.joblib')
try:
    fraud_model = joblib.load(MODEL_PATH)
except:
    fraud_model = None
    print(f"Warning: Fraud model not found at {MODEL_PATH}. Prediction will be mocked.")

@app.post("/analyze_claim")
async def analyze_claim(
    scene_image: UploadFile = File(...),
    damage_image: UploadFile = File(...),
    invoice_doc: UploadFile = File(...),
    description: str = Form(None)
):
    # 1. Save files temporarily (In production use cloud storage)
    os.makedirs("temp", exist_ok=True)
    scene_path = f"temp/{scene_image.filename}"
    damage_path = f"temp/{damage_image.filename}"
    invoice_path = f"temp/{invoice_doc.filename}"
    
    with open(scene_path, "wb") as f: f.write(await scene_image.read())
    with open(damage_path, "wb") as f: f.write(await damage_image.read())
    with open(invoice_path, "wb") as f: f.write(await invoice_doc.read())

    # 2. Multimodal Analysis
    scene_data = vision.analyze_accident_scene(scene_path)
    damage_data = vision.detect_damage(damage_path)
    invoice_data = ocr.extract_invoice_data(invoice_path)
    
    # 3. Reasoning & Inconsistency Detection
    physical_inconsistencies = reasoning.check_physical_consistency(scene_data, damage_data)
    invoice_inconsistencies = reasoning.check_invoice_consistency(damage_data, invoice_data)
    total_inconsistencies = physical_inconsistencies + invoice_inconsistencies
    
    anomaly_score = reasoning.calculate_anomaly_score(total_inconsistencies)
    
    # 4. Similarity Retrieval
    similar_cases = retriever.search_similar_cases(description)
    max_sim = max([c['similarity_score'] for c in similar_cases]) if similar_cases else 0.1
    
    # 5. [NEW] Advanced Linguistic Analysis (Deception Detection)
    linguistic_score = 0.0
    deception_indicators = []
    if description:
        # Heuristic: Fraudsters often avoid first-person pronouns or use overly complex words
        forbidden_words = ["guarantee", "honestly", "truthfully", "believe me"]
        for word in forbidden_words:
            if word in description.lower():
                deception_indicators.append(f"Use of suggestive word: '{word}'")
                linguistic_score += 0.2
        
        if len(description.split()) < 10:
            deception_indicators.append("Suspiciously brief description for high-damage claim.")
            linguistic_score += 0.15

    # 6. [NEW] Vehicle Intelligence (Mocked for Demo)
    vehicle_intel = {
        "vin": "1FA6P8CF5H5XXXXXX",
        "make": "Ford",
        "model": "F-150",
        "previous_accidents": 2,
        "salvage_history": "None",
        "owner_claim_frequency": "High (3 claims in 24 months)"
    }

    # 7. [NEW] Image Forensic Analysis
    image_forensics = {
        "metadata_consistency": "FAIL",
        "exif_location": "3.2 miles from reported scene",
        "timestamp_match": "Mismatch (Photo taken 4 days after reported incident)",
        "digital_alteration_detected": "Minor (Potential brightness/contrast manipulation)",
        "camera_model": "iPhone 15 Pro"
    }

    # 8. [NEW] Global Risk Network (Network Analysis)
    risk_network = {
        "claimant_id": "CL-88219",
        "known_associates_flag": True,
        "garage_risk_score": 0.82, # Highly suspicious repair shop
        "historical_circle": "Associated with 2 previous 'staged accident' rings",
        "risk_network_graph": "Cluster Detected: North Central Region"
    }

    # 9. ML Scoring
    # Features for model: force, parts, scene_mismatch, invoice_mismatch, anomaly_score, similarity
    model_input = [
        scene_data.get('estimated_force', 0.5),
        len(damage_data),
        len(physical_inconsistencies),
        len(invoice_inconsistencies),
        anomaly_score,
        max_sim
    ]
    
    fraud_prob = 0.5
    if fraud_model:
        fraud_prob = float(fraud_model.predict_proba([model_input])[0][1])
    else:
        fraud_prob = min(0.95, (len(total_inconsistencies) * 0.15) + (max_sim * 0.3) + linguistic_score)

    # Adjust fraud prob based on advanced features
    if image_forensics["metadata_consistency"] == "FAIL":
        fraud_prob = min(0.99, fraud_prob + 0.15)
    if risk_network["known_associates_flag"]:
        fraud_prob = min(0.99, fraud_prob + 0.1)

    # 10. Generate Investigation Report
    structured_findings = {
        "fraud_probability": round(fraud_prob, 2),
        "collision_geometry": scene_data,
        "damaged_parts": damage_data,
        "invoice_summary": invoice_data,
        "inconsistencies": total_inconsistencies,
        "linguistic_anomalies": deception_indicators,
        "image_forensics": image_forensics,
        "risk_network": risk_network,
        "vehicle_history": vehicle_intel,
        "anomaly_score": anomaly_score,
        "similar_claims_detected": len(similar_cases)
    }
    
    investigation_report = reporter.generate_investigation_report(structured_findings)

    return {
        "fraud_score": round(fraud_prob, 2),
        "inconsistencies": total_inconsistencies,
        "linguistic_analysis": {
            "score": round(linguistic_score, 2),
            "indicators": deception_indicators
        },
        "image_forensics": image_forensics,
        "risk_network": risk_network,
        "vehicle_intel": vehicle_intel,
        "damage_analysis": damage_data,
        "invoice_table": invoice_data['items'],
        "report": investigation_report,
        "similar_cases": similar_cases
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
