terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.0.0, < 7.0.0"
    }
  }
}

provider "google" {
  project = var.project_id
}

# VPC
resource "google_compute_network" "vpc" {
  name                    = "configuration-service-vpc"
  auto_create_subnetworks = false
}

# Subnet
resource "google_compute_subnetwork" "default-subnetwork" {
  name          = "configuration-service-default-subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.vpc.id
  region        = "europe-west1"
}

# Redis
resource "google_redis_instance" "cache" {
  name           = "configuration-service-redis-cache"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = "europe-west1"

  authorized_network = google_compute_network.vpc.id
  connect_mode       = "DIRECT_PEERING"

  redis_version = "REDIS_6_X"
  display_name  = "Configuration Service Redis Cache"
}

# Allow incoming connections to Redis from subnet
resource "google_compute_firewall" "allow_redis" {
  name    = "allow-redis"
  network = google_compute_network.vpc.id

  allow {
    protocol = "tcp"
    ports    = ["6379"]
  }

  source_ranges = ["10.0.0.0/24"]
}

# VPC Connector for Cloud Run to connect VPC based instances like Redis
resource "google_vpc_access_connector" "vpc_connector" {
  name          = "cloud-run-vpc-connector"
  region        = "europe-west1"
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.8.0.0/28"
  min_instances = 2
  max_instances = 3
}

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
        image = var.image_url

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
        image = var.ui_image_url

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


