## Introduction
This report presents the design and implementation of an automated deployment pipeline for a web application using cloud infrastructure and DevOps tools. The main objective is to demonstrate how infrastructure provisioning, server configuration, application containerization, and continuous deployment can be integrated to achieve a streamlined, reliable, and scalable deployment process.
The report covers four key areas: first, setting up cloud infrastructure using Infrastructure as Code tools; second, automating server setup and software installation; third, containerizing the application with Docker and deploying it on the cloud server; and finally, integrating a CI/CD pipeline to enable automatic updates upon code changes. Each section includes detailed explanations and practical implementations to showcase how automation reduces manual effort and improves deployment efficiency.
By following this approach, the report aims to provide a comprehensive understanding of modern deployment practices and highlight the benefits of automation in managing application lifecycles in cloud environments.

## Tools Used in the Project
1.	Terraform
2.	Ansible
3.	Docker
4.	GitHub Actions (CI/CD Pipeline)
5.	React
6.	Ubuntu on Windows Subsystem for Linux (WSL)


## Part 1: Infrastructure Setup using terrraform
[Terraform AWS Repository](https://github.com/uz-zi/terraform_aws)

## Part 3: Docker Container and Image Deployment

### Objective

Containerize a React web application using **Docker**, build the Docker image, and push it to **Docker Hub** for deployment.

## Steps to Deploy

### 1. Create React Application

- Initialized a new React app using:

  ```bash
  npx create-react-app react-app
  ```
- Added routes and router dom, and bootstrap package

### 2 Write Dockerfile to Containerize the React App

Created a multi-stage Dockerfile for optimized build and deployment:
- The first stage builds the React app.
- The second stage serves the static build using Nginx.

#### Why use Nginx?
- Nginx is a lightweight, high-performance web server and reverse proxy server. It is widely used to serve static files efficiently.
- React apps are Single Page Applications (SPA) that need the web server to correctly serve index.html for all routes, enabling client-side routing.
- Nginx can handle static file serving with caching, gzip compression, and handle fallback routing elegantly.

### 3 Build Docker Image Locally
Build the Docker image, tagging it with the Docker Hub username and repository name:
```bash
docker build -t <dockerhub_username>/react-app:latest .
```

### 4 Push Docker Image to Docker Hub
Log in to Docker Hub:
```bash
docker login
```
Push the image:
```bash
docker push <dockerhub_username>/react-app:latest
```

Verify Docker Image
- Verify using commands:
```bash
    docker ps –a
    docker images
```
- The image is now available on Docker Hub, ready to be pulled and run on the EC2 instance.
- Deployment and running of the container on EC2 is automated in Part 2 using Ansible.

Summary
- Created a React app using Create React App.
- Wrote a Dockerfile to containerize and serve the React app via Nginx.
- Built and pushed the Docker image to Docker Hub.
- Prepared the image for automated deployment on the EC2 instance.

## Part 2: Configuration Management with Ansible
[Anisble setup to pull the docker image on server](https://github.com/uz-zi/terraform_aws)



## Part 4: CI/CD Pipeline Integration
### Objective
Automate the build and deployment process of your Dockerized React application to the EC2 instance whenever you push code changes to the GitHub repository. This ensures continuous integration and continuous delivery with minimal manual intervention.
Architecture Diagram
 
### Tools Used
-	GitHub Actions: For automating workflows triggered on code pushes.
-	Docker Hub: For hosting the Docker images.
-	SSH: For securely connecting to the EC2 instance.
-	EC2 instance: Target server where the Docker container runs.

### Pipeline Workflow Overview
1.	Code Checkout: GitHub Actions fetches the latest code from the repository.
2.	Docker Build: The React app Docker image is built.
3.	Docker Push: The image is pushed to Docker Hub.
4.	Deployment via SSH: Connects to EC2 and pulls the latest image, stops the old container, and runs a new container with the updated image.

### GitHub Actions Workflow Configuration
Create GitHub Actions YAML file (.github/workflows/deploy.yml) looks like this:

#### Create the Secrets Configuration in GitHub Repository
-	DOCKER_USERNAME: Your Docker Hub username.
-	DOCKER_PASSWORD: Your Docker Hub password or access token.
-	SSH_PRIVATE_KEY_B64: Base64 encoded content of your EC2 private SSH key (id_rsa).
-	EC2_PUBLIC_IP: Public IP address of your EC2 instance.
  
###### How to encode your private key in base64:
	base64 -w 0 ~/.ssh/id_rsa > id_rsa_base64.txt
######	why to encode?
The ~/.ssh/id_rsa file is your private SSH key, typically in PEM format (Privacy Enhanced Mail). It is a plaintext file but contains cryptographic data with specific formatting.
```bash
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAA...
... (many lines of base64-encoded data)
-----END OPENSSH PRIVATE KEY-----
```
Platforms like GitHub Actions, Docker, or cloud APIs often expect secrets to be in a single line. So that's why.


### How the pipline Works
-	On every push to the master branch, this pipeline triggers.
-	It builds the latest Docker image of your React app.
-	Pushes the image to Docker Hub.
-	SSHs into your EC2 instance securely.
-	Pulls the latest Docker image.
-	Stops and removes the existing container if running.
-	Runs a new container with the updated image, ensuring the app is up to date.

### Testing the Pipeline
-	Push a change to the master branch in your GitHub repo.
-	Monitor the Actions tab in GitHub to see the pipeline run through each step.
-	After the workflow completes successfully, open your EC2 public IP in a browser to verify the updated app is live.


### Summary
-	Achieved fully automated CI/CD with GitHub Actions.
-	Docker images are built and pushed seamlessly.
-	Deployment to EC2 is automated via SSH and Docker commands.
-	Updates are live immediately after code changes are pushed.





