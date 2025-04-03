# Backend Service
resource "google_cloud_run_service" "server" {
  name     = "prod-configuration-service-server"
  location = "europe-west1"
  project  = var.project_id

  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  template {
    spec {
      containers {
        image = "europe-west1-docker.pkg.dev/${var.project_id}/${var.repo_id}/${var.image_name}"

        env {
          name  = "FIREBASE_PROJECT_ID"
          value = var.firebase_project_id
        }
        env {
          name  = "FIREBASE_PRIVATE_KEY"
          value = var.firebase_private_key
        }
        env {
          name  = "FIREBASE_CLIENT_EMAIL"
          value = var.firebase_client_email
        }
        env {
          name  = "API_TOKEN"
          value = var.api_token
        }
        env {
          name  = "REDIS_HOST"
          value = google_redis_instance.cache.host
        }

        resources {
          limits = {
            cpu    = "0.25"
            memory = "128Mi"
          }
        }
      }
    }

    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.vpc_connector.name
      }
    }
  }
}

# Grant unauthenticated access to backend service
resource "google_cloud_run_service_iam_binding" "unauthenticated" {
  location = "europe-west1"
  project  = var.project_id
  service  = google_cloud_run_service.server.name

  role    = "roles/run.invoker"
  members = ["allUsers"]
}

# Frontend Service
resource "google_cloud_run_service" "ui" {
  name     = "prod-configuration-service-ui"
  location = "europe-west1"
  project  = var.project_id

  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  template {
    spec {
      containers {
        image = "europe-west1-docker.pkg.dev/${var.project_id}/${var.repo_id}/${var.ui_image_name}"

        env {
          name  = "VITE_FIREBASE_API_KEY"
          value = var.firebase_api_key
        }
        env {
          name  = "VITE_FIREBASE_AUTH_DOMAIN"
          value = var.firebase_auth_domain
        }
        env {
          name  = "VITE_FIREBASE_PROJECT_ID"
          value = var.firebase_project_id
        }
        env {
          name  = "VITE_FIREBASE_STORAGE_BUCKET"
          value = var.firebase_storage_bucket
        }
        env {
          name  = "VITE_FIREBASE_MESSAGING_SENDER_ID"
          value = var.firebase_messaging_sender_id
        }
        env {
          name  = "VITE_FIREBASE_APP_ID"
          value = var.firebase_app_id
        }
        env {
          name  = "VITE_API_TOKEN"
          value = var.api_token
        }
        env {
          name  = "VITE_BACKEND_URL"
          value = google_cloud_run_service.server.status[0].url
        }

        resources {
          limits = {
            cpu    = "0.25"
            memory = "128Mi"
          }
        }
      }
    }
  }
}

# Grant unauthenticated access to frontend service
resource "google_cloud_run_service_iam_binding" "unauthenticated_ui" {
  location = "europe-west1"
  project  = var.project_id
  service  = google_cloud_run_service.ui.name

  role    = "roles/run.invoker"
  members = ["allUsers"]
}