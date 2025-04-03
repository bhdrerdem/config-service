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