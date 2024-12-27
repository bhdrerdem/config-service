output "redis_host" {
  value       = google_redis_instance.cache.host
  description = "Redis instance host"
}

output "redis_port" {
  value       = google_redis_instance.cache.port
  description = "Redis instance port"
} 
