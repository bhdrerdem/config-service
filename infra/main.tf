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
  name                    = "codeway-case-vpc"
  auto_create_subnetworks = false
}

# Subnet
resource "google_compute_subnetwork" "default-subnetwork" {
  name          = "codeway-case-default-subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.vpc.id
  region        = "europe-west1"
}

# Redis
resource "google_redis_instance" "cache" {
  name           = "redis-cache"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = "europe-west1"

  authorized_network = google_compute_network.vpc.id
  connect_mode       = "DIRECT_PEERING"

  redis_version = "REDIS_6_X"
  display_name  = "Codeway Case Redis Cache"
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

# Service Account for Cloud Run
module "service_account" {
  source     = "terraform-google-modules/service-accounts/google"
  version    = "~> 4.2"
  project_id = var.project_id
  prefix     = "sa-cloud-run"
  names      = ["backend"]
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
resource "google_cloud_run_service" "main" {
  name     = "ci-cloud-run"
  location = "europe-west1"
  project  = var.project_id

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
        "run.googleapis.com/ingress"             = "all"
      }
    }
  }
}

# Grant unauthenticated access to backend service
resource "google_cloud_run_service_iam_binding" "unauthenticated" {
  location = "europe-west1"
  project  = var.project_id
  service  = google_cloud_run_service.main.name

  role    = "roles/run.invoker"
  members = ["allUsers"]
}


