# Configuration Service

## Overview

The Configuration Service is a full-stack, cloud-native application designed to centrally manage and deliver remote configuration settings for various audiences or user segments. It enables dynamic control over feature flags, environment-specific settings, and other key configurations without requiring code changes or redeployment. The system leverages Firebase for authentication and Firestore for data storage, with Redis for caching. The application is containerized using Docker and deployed on Google Cloud Platform (GCP) using Cloud Run.

## Features

- **Configuration Management**: Create, update, delete, and view configurations.
- **Audience Management**: Manage audiences with similar CRUD operations.
- **Overrides**: Apply configuration overrides for specific audiences.
- **Authentication**: Secure login using Firebase authentication.
- **Caching**: Utilizes Redis for efficient data retrieval.
- **Deployment**: Containerized with Docker and deployed on GCP.

## System Architecture

- **Frontend**: Built with Vue.js, using Vite for development and build processes.
- **Backend**: Node.js with Express, using TypeScript.
- **Database**: Firestore for storing configurations and audience data.
- **Authentication**: Firebase Authentication for user management.
- **Caching**: Redis for caching frequently accessed data.
- **Deployment**: Dockerized and deployed on GCP Cloud Run.

## Infrastructure as Code (IaC)

The infrastructure is managed using Terraform, which allows for consistent and repeatable deployments.

## Deployment Pipelines

Deployment pipelines are set up using GitHub Actions. These pipelines automate the build, test, and deployment processes, ensuring that changes are quickly and reliably delivered to production.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bhdrerdem/config-service.git
   ```

2. **Install dependencies**:

   - For the server:
     ```bash
     cd server
     npm install
     ```
   - For the app:
     ```bash
     cd app
     npm install
     ```

3. **Environment Configuration**:
   - Create a `.env` file in the `server` directory with the following variables:
   ```plaintext
   PORT=8080
   REDIS_HOST=localhost
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   API_TOKEN=your-api-token
   ```
   - Create a `.env` file in the `app` directory with the following variables:
   ```plaintext
   VITE_BACKEND_URL=http://localhost:8080
   VITE_API_TOKEN=your-api-token
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-firebase-app-id
   ```

## Development

- **Start the server**:

  ```bash
  cd server
  npm run start:dev
  ```

- **Start the frontend**:
  ```bash
  cd app
  npm run dev
  ```

## Deployment

1. **Install Terraform**: Ensure you have Terraform installed on your machine. You can download it from the [Terraform website](https://www.terraform.io/downloads.html).

2. **Configure Google Cloud SDK**: Make sure you have the Google Cloud SDK installed and configured. Authenticate with your GCP account:

   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Navigate to the Infrastructure Directory**:

   ```bash
   cd infra
   ```

4. **Generate `terraform.tfvars` File**: Use the environment variables from your application to create a `terraform.tfvars` file. This file should include the necessary variables for Terraform to deploy your infrastructure. You can extract these from your `.env` files in the `app` and `server` directories:

   ```plaintext
   project_id = "your-gcp-project-id"
   repo_id = "your-repo-id"
   image_name = "your-server-image-name"
   ui_image_name = "your-ui-image-name"
   firebase_project_id = "your-firebase-project-id"
   firebase_private_key = "your-firebase-private-key"
   firebase_client_email = "your-firebase-client-email"
   api_token = "your-api-token"
   firebase_api_key = "your-firebase-api-key"
   firebase_auth_domain = "your-firebase-auth-domain"
   firebase_storage_bucket = "your-firebase-storage-bucket"
   firebase_messaging_sender_id = "your-firebase-messaging-sender-id"
   firebase_app_id = "your-firebase-app-id"
   ```

5. **Initialize Terraform**: This command will download the necessary provider plugins.

   ```bash
   terraform init
   ```

6. **Step 1 – Create the Artifact Registry**: Apply only the Artifact Registry resource to set up the Docker repository.

   ```bash
   terraform apply -target=google_artifact_registry_repository.repository
   ```

7. **Step 2 – Build & Push the Docker Image**: Build your Docker image and push it to the Artifact Registry.

   ```bash
   cd ../server
   docker build --platform=linux/amd64 -t europe-west1-docker.pkg.dev/${project_id}/${repo_id}/${image_name} .
   docker push europe-west1-docker.pkg.dev/${project_id}/${repo_id}/${image_name}
   cd ../app
   docker build --platform=linux/amd64 -t europe-west1-docker.pkg.dev/${project_id}/${repo_id}/${ui_image_name} .
   docker push europe-west1-docker.pkg.dev/${project_id}/${repo_id}/${ui_image_name}
   ```

8. **Step 3 – Apply the Rest of the Infrastructure**: Now that the Docker image is available, apply the rest of the Terraform configuration to deploy the Cloud Run services and other resources.

   ```bash
   terraform apply
   ```

By following these steps, you ensure that the Artifact Registry is set up before building and pushing Docker images, and that the rest of the infrastructure is applied only after the images are available. This sequence helps prevent deployment issues related to missing images.

## API Endpoints

Here are the main API endpoints available in the application:

### Configurations

- **Get All Configurations**

  - **Endpoint**: `GET /api/v1/configurations`
  - **Description**: Retrieve a list of all configurations.
  - **Query Parameter**: `audience` (optional) - Override configurations by audience.

- **Get All Configurations for Mobile**

  - **Endpoint**: `GET /api/v1/configurations/mobile`
  - **Description**: Override configurations optimized for mobile clients.
  - **Query Parameter**: `audience` (optional) - Filter configurations by audience.

- **Create Configuration**

  - **Endpoint**: `POST /api/v1/configurations`
  - **Example Request Body**:
    ```json
    {
      "parameterKey": "exampleKey",
      "value": "exampleValue",
      "description": "This is an example configuration"
    }
    ```

- **Update Configuration**

  - **Endpoint**: `PUT /api/v1/configurations/:id`
  - **Example Request Body**:
    ```json
    {
      "value": "updatedValue",
      "description": "Updated description"
    }
    ```

- **Delete Configuration**
  - **Endpoint**: `DELETE /api/v1/configurations/:id`

### Audiences

- **Get All Audiences**

  - **Endpoint**: `GET /api/v1/audiences`
  - **Description**: Retrieve a list of all audiences.

- **Create Audience**

  - **Endpoint**: `POST /api/v1/audiences`
  - **Example Request Body**:
    ```json
    {
      "name": "exampleAudience",
      "description": "This is an example audience"
    }
    ```

- **Update Audience**

  - **Endpoint**: `PUT /api/v1/audiences/:id`
  - **Example Request Body**:
    ```json
    {
      "description": "Updated audience description"
    }
    ```

- **Delete Audience**
  - **Endpoint**: `DELETE /api/v1/audiences/:id`

### Overrides

- **Get All Overrides**

  - **Endpoint**: `GET /api/v1/overrides`
  - **Description**: Retrieve a list of all configuration overrides.

- **Create Override**

  - **Endpoint**: `POST /api/v1/overrides`
  - **Example Request Body**:
    ```json
    {
      "audience": {
        "name": "COUNTRY_TR"
      },
      "configuration": {
        "id": "1234"
      },
      "value": "overrideValue"
    }
    ```

- **Update Override**

  - **Endpoint**: `PUT /api/v1/overrides/:id`
  - **Example Request Body**:
    ```json
    {
      "value": "newOverrideValue"
    }
    ```

- **Delete Override**
  - **Endpoint**: `DELETE /api/v1/overrides/:id`
