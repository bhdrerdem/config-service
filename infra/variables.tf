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

variable "firebase_api_key" {
  description = "Firebase API Key"
  type        = string
}

variable "firebase_auth_domain" {
  description = "Firebase Auth Domain"
  type        = string
}

variable "firebase_storage_bucket" {
  description = "Firebase Storage Bucket"
  type        = string
}

variable "firebase_messaging_sender_id" {
  description = "Firebase Messaging Sender ID"
  type        = string
}

variable "firebase_app_id" {
  description = "Firebase App ID"
  type        = string
}

variable "ui_image_url" {
  description = "Frontend image url"
  type = string
}