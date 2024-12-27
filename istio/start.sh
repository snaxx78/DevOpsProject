#!/bin/bash

# Start Minikube
echo "Starting Minikube..."
minikube start --cpus 6 --memory 8192

sleep 5

# Check Minikube status
echo -e "\nChecking Minikube status..."
minikube status

./bin/istioctl install 

kubectl get ns
kubectl get pod -n istio-system

kubectl label namespace default istio-injection=enabled

kubectl get ns default --show-labels

kubectl apply -f manifest.yaml

kubectl apply -f ./addons/

kubectl get services -n istio-system

kubectl port-forward svc/kiali -n istio-system 20001