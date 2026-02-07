import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class ClaimRetriever:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.claims = []
        
        # Seed with some known suspicious cases
        self._seed_database()

    def _seed_database(self):
        cases = [
            "Intentional front-end collision for insurance payout in parking lot.",
            "Staged accident with pre-damaged parts swapped before inspection.",
            "Inflated repair costs with ghost parts in collaboration with local garage.",
            "Double dipping: claiming same damage on multiple insurance policies.",
            "Reported hit-and-run that was actually a collision with a fixed object."
        ]
        self.add_cases(cases)

    def add_cases(self, cases):
        self.claims.extend(cases)
        embeddings = self.model.encode(cases)
        self.index.add(np.array(embeddings).astype('float32'))

    def search_similar_cases(self, description, k=2):
        if not description:
            return []
        
        query_embedding = self.model.encode([description])
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.claims):
                results.append({
                    "case": self.claims[idx],
                    "similarity_score": float(1.0 / (1.0 + distances[0][i]))
                })
        return results
