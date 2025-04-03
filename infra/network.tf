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

# VPC Connector for Cloud Run to connect VPC based instances like Redis
resource "google_vpc_access_connector" "vpc_connector" {
  name          = "cloud-run-vpc-connector"
  region        = "europe-west1"
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.8.0.0/28"
  min_instances = 2
  max_instances = 3
}