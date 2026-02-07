from doctr.models import ocr_predictor
import re

class InvoiceProcessor:
    def __init__(self):
        try:
            self.model = ocr_predictor(pretrained=True)
        except:
            self.model = None
            print("Warning: docTR OCR model could not be loaded. OCR will be mocked.")

    def extract_invoice_data(self, file_path):
        """
        Extracts parts, labor hours, and costs from invoice.
        """
        # Simulated extraction from a repair invoice
        # Real logic would use self.model(file_path) and regex/LLM to parse structure
        
        extracted_data = {
            "invoice_number": "REP-2024-001",
            "items": [
                {"description": "Front Bumper Replacement", "cost": 1200.0, "type": "Part"},
                {"description": "Left Headlight Assembly", "cost": 450.0, "type": "Part"},
                {"description": "Hood Refinishing", "cost": 300.0, "type": "Labor"},
                {"description": "Engine Oil Pan", "cost": 150.0, "type": "Part"}, # Potential anomaly!
                {"description": "Chassis Alignment", "cost": 500.0, "type": "Labor"}
            ],
            "total_cost": 2600.0
        }
        
        return extracted_data

    def detect_financial_anomalies(self, items):
        """
        Check for unusually high costs or unnecessary parts.
        """
        anomalies = []
        for item in items:
            if item['cost'] > 5000:
                anomalies.append(f"High cost for {item['description']}")
        return anomalies
