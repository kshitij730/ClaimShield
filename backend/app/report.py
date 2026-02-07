from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

class ReportGenerator:
    def __init__(self):
        # API Key should be in environment
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY", "MISSING_KEY"))

    def generate_investigation_report(self, structured_data):
        """
        Generates a professional investigation report based on extracted evidence.
        """
        prompt = f"""
        # ROLE: Senior Forensic Claims Adjuster & Fraud Specialist
        # TASK: Generate a detailed, high-impact investigation report based on the evidence below.

        EVIDENCE DATA (JSON):
        {json.dumps(structured_data, indent=2)}

        # REPORT GUIDELINES:
        1. Use clear, professional forensic language.
        2. Use MARKDOWN headings (###).
        3. Use BOLD for critical findings (e.g., **INCONSISTENCY DETECTED**).
        4. Create a "EXECUTIVE SUMMARY" section first with a clear "Status: RED/YELLOW/GREEN".
        5. Create a "EVIDENCE CONSISTENCY" table using markdown.
        6. Highlight specific mismatches between Visual Damage vs repair Invoice.
        7. Provide a "FRAUD INDICATOR JUSTIFICATION" section explaining why the score is what it is.
        8. End with "LEGAL RECOMMENDATION" (e.g., Proceed to SIU investigation).

        Output the report in professional Markdown format.
        """

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a specialized insurance fraud reasoning engine. Output as professional markdown."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error generating report: {str(e)}\n\n(Fallback: Manual report generation based on inconsistencies: {', '.join(structured_data.get('inconsistencies', []))})"
