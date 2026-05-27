terraform {
  required_version = ">= 1.6.0"
}

variable "enable_paid_cloud_resources" {
  type        = bool
  default     = false
  description = "Keep false for the assignment/demo. Set true only when a paid cloud account is approved."

  validation {
    condition     = var.enable_paid_cloud_resources == false
    error_message = "Paid cloud resource creation is intentionally disabled in this repository."
  }
}

output "claimshield_local_controls" {
  value = {
    frontend     = "Next.js local or Vercel preview"
    backend      = "FastAPI Docker container"
    scanners     = ["Trivy", "OWASP Dependency-Check", "Snyk", "SonarQube"]
    observability = ["Prometheus", "Grafana", "ELK"]
    policy       = ["OPA", "Sentinel-ready"]
  }
}
