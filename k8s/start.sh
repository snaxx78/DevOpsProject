#!/bin/bash

# Start Minikube
echo "Starting Minikube..."
minikube start --cpus 6 --memory 8192

sleep 5

# Check Minikube status
echo -e "\nChecking Minikube status..."
minikube status

# Apply Kubernetes resources
kubectl apply -f redis-pv.yaml
kubectl apply -f redis-pvc.yaml
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml

sleep 20

kubectl get pods
kubectl get deployments
kubectl get services
kubectl get pvc
kubectl get pv   

# Expose the userapi service
minikube service userapi
