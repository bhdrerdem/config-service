output "redis_host" {
  value       = google_redis_instance.cache.host
  description = "Redis instance host"
}

output "backend_service_url" {
  value       = google_cloud_run_service.server.status[0].url
  description = "URL of the backend Cloud Run service"
}

output "frontend_service_url" {
  value       = google_cloud_run_service.ui.status[0].url
  description = "URL of the frontend Cloud Run service"
}
