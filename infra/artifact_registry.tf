# Artifact Registry
resource "google_artifact_registry_repository" "repository" {
  location      = "europe-west1"
  repository_id = var.repo_id
  format        = "DOCKER"
  description   = "Artifact Registry for config service server and ui images"
}