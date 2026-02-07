class ReasoningEngine:
    def __init__(self):
        pass

    def check_physical_consistency(self, scene_metadata, damage_detections):
        """
        Compare accident scene estimates with vehicle damage.
        Example: low-speed rear collision cannot realistically produce full front engine damage.
        """
        inconsistencies = []
        
        impact_dir = scene_metadata.get("impact_direction", "").lower()
        severity = scene_metadata.get("estimated_force", 0)
        
        # Logic: If impact is REAR but we see FRONT damage
        front_damage = any("front" in d['part'].lower() or "hood" in d['part'].lower() for d in damage_detections)
        rear_damage = any("rear" in d['part'].lower() or "trunk" in d['part'].lower() for d in damage_detections)
        
        if "rear" in impact_dir and front_damage and not rear_damage:
            inconsistencies.append("Front damage detected but scene indicates rear impact.")
            
        if severity < 0.2 and len(damage_detections) > 5:
            inconsistencies.append("Visual damage severity exceeds estimated collision force.")
            
        return inconsistencies

    def check_invoice_consistency(self, damage_detections, invoice_data):
        """
        Compare billed components with visually detected damaged components.
        """
        inconsistencies = []
        visual_parts = [d['part'].lower() for d in damage_detections]
        billed_items = invoice_data.get("items", [])
        
        for item in billed_items:
            if item['type'] == 'Part':
                # Fuzzy match or simple containment
                part_name = item['description'].lower()
                found = any(vp in part_name for vp in visual_parts)
                
                # Check for parts in invoice that weren't visible in damage
                if not found:
                    # Some parts might be internal, but let's flag suspicious ones
                    suspicious_internal = ["pan", "radiator", "engine"]
                    if any(si in part_name for si in suspicious_internal):
                        inconsistencies.append(f"Billed internal part '{item['description']}' has no corresponding external impact indicators.")
                    else:
                        inconsistencies.append(f"Billed part '{item['description']}' was not detected in damage photos.")
                        
        return inconsistencies

    def calculate_anomaly_score(self, inconsistencies):
        # Weighted score
        return len(inconsistencies) * 15.0 # Basic linear score for demo
