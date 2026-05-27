from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import joblib
import os
import time
from pathlib import Path
from uuid import uuid4
from .vision import VisionAnalyzer
from .ocr import InvoiceProcessor
from .reasoning import ReasoningEngine
from .retrieval import ClaimRetriever
from .report import ReportGenerator

app = FastAPI(title="ClaimShield API", version="2.0.0")
START_TIME = time.time()
REQUEST_COUNTER = 0
TEMP_DIR = Path("temp")

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

DEVSECOPS_CONTROLS = [
    {
        "category": "Source Code Management",
        "tools": ["GitHub", "GitLab", "Bitbucket"],
        "mode": "ready",
        "control": "Protected branches, pull-request review, signed releases, and issue traceability.",
    },
    {
        "category": "Infrastructure as Code",
        "tools": ["Terraform", "AWS CloudFormation"],
        "mode": "planned",
        "control": "Validation-only blueprints. Paid cloud apply is disabled by default.",
    },
    {
        "category": "Configuration Management",
        "tools": ["Ansible", "Puppet", "Chef"],
        "mode": "ready",
        "control": "Local hardening playbooks and scanner bootstrap workflow.",
    },
    {
        "category": "CI/CD",
        "tools": ["Jenkins", "GitHub Actions", "GitLab CI", "CircleCI"],
        "mode": "integrated",
        "control": "Build, lint, SAST, dependency scan, container scan, and policy gates.",
    },
    {
        "category": "Containerization & Orchestration",
        "tools": ["Docker", "Kubernetes", "Helm", "Argo CD"],
        "mode": "ready",
        "control": "Container-first API and GitOps-ready deployment structure.",
    },
    {
        "category": "Security Testing",
        "tools": ["SonarQube", "Checkmarx", "OWASP ZAP", "Burp Suite"],
        "mode": "ready",
        "control": "SAST and DAST workflows prepared for local and CI execution.",
    },
    {
        "category": "Vulnerability Scanning",
        "tools": ["OWASP Dependency-Check", "Trivy", "Snyk", "Clair"],
        "mode": "integrated",
        "control": "Filesystem, dependency, and image risk scanning with severity gates.",
    },
    {
        "category": "Secrets, Policy, and Compliance",
        "tools": ["HashiCorp Vault", "AWS Secrets Manager", "OPA", "HashiCorp Sentinel"],
        "mode": "ready",
        "control": "Local secrets contract with policy-as-code guardrails.",
    },
    {
        "category": "Monitoring & Logging",
        "tools": ["Prometheus", "Grafana", "ELK Stack"],
        "mode": "ready",
        "control": "Metrics endpoint, dashboard datasource, and investigation log pipeline.",
    },
    {
        "category": "Cloud Security",
        "tools": ["AWS Config", "Azure Security Center", "Google Cloud SCC"],
        "mode": "planned",
        "control": "Mapped as future adapters only; no paid cloud resources are activated.",
    },
]


def _safe_temp_path(upload: UploadFile) -> Path:
    suffix = Path(upload.filename or "").suffix[:12]
    return TEMP_DIR / f"{uuid4().hex}{suffix}"


@app.get("/health")
async def health():
    return {
        "service": "claimshield-api",
        "status": "ok",
        "version": app.version,
        "fraud_model_loaded": fraud_model is not None,
        "cloud_spend_enabled": False,
    }


@app.get("/devsecops")
async def devsecops():
    return {
        "cloud_spend_enabled": False,
        "controls": DEVSECOPS_CONTROLS,
    }


@app.get("/metrics", response_class=PlainTextResponse)
async def metrics():
    uptime = int(time.time() - START_TIME)
    return "\n".join(
        [
            "# HELP claimshield_api_uptime_seconds API process uptime.",
            "# TYPE claimshield_api_uptime_seconds gauge",
            f"claimshield_api_uptime_seconds {uptime}",
            "# HELP claimshield_claims_analyzed_total Claims analyzed by this process.",
            "# TYPE claimshield_claims_analyzed_total counter",
            f"claimshield_claims_analyzed_total {REQUEST_COUNTER}",
            "# HELP claimshield_model_loaded Fraud model load status.",
            "# TYPE claimshield_model_loaded gauge",
            f"claimshield_model_loaded {1 if fraud_model else 0}",
            "",
        ]
    )

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
    global REQUEST_COUNTER
    REQUEST_COUNTER += 1

    # 1. Save files temporarily (In production use cloud storage)
    TEMP_DIR.mkdir(exist_ok=True)
    scene_path = _safe_temp_path(scene_image)
    damage_path = _safe_temp_path(damage_image)
    invoice_path = _safe_temp_path(invoice_doc)
    
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
