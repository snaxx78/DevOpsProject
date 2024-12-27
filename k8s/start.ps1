# Start Minikube
Write-Host "Starting Minikube...`n"
minikube start --cpus 6 --memory 8192

Start-Sleep -Seconds 5

# Check Minikube status
Write-Host "`nChecking Minikube status...`n"
minikube status

kubectl apply -f redis-pv.yaml
kubectl apply -f redis-pvc.yaml
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml

Start-Sleep -Seconds 20

kubectl get pods
kubectl get deployments
kubectl get services
kubectl get pvc
kubectl get pv   

minikube service userapi