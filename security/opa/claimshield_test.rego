package claimshield.devsecops

import rego.v1

test_public_iac_without_justification_is_denied if {
  deny[_] with input as {
    "kind": "iac",
    "resources": [{"name": "demo_bucket", "public": true}]
  }
}

test_public_iac_with_justification_is_allowed if {
  count(deny) == 0 with input as {
    "kind": "iac",
    "resources": [{"name": "demo_dashboard", "public": true, "justification": "public demo endpoint"}]
  }
}
