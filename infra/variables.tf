variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "image_url" {
  description = "Image URL from backend service"
  type        = string
}

variable "firebase_project_id" {
  description = "Firebase project ID"
  type        = string
}

variable "firebase_private_key" {
  description = "Firebase private key"
  type        = string
}

variable "firebase_client_email" {
  description = "Firebase client email"
  type        = string
}

variable "api_token" {
  description = "API token"
  type        = string
}