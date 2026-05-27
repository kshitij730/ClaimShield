package claimshield.devsecops

import rego.v1

deny contains msg if {
  input.kind == "dockerfile"
  instruction := input.instructions[_]
  lower(instruction.Cmd) == "user"
  instruction.Value[0] == "root"
  msg := "Containers must not run as root in production images."
}

deny contains msg if {
  input.kind == "fastapi"
  input.cors.allow_origins[_] == "*"
  input.environment == "production"
  msg := "Production CORS must not allow every origin."
}

deny contains msg if {
  input.kind == "iac"
  resource := input.resources[_]
  resource.public == true
  not resource.justification
  msg := sprintf("Public resource %s needs a documented business justification.", [resource.name])
}
