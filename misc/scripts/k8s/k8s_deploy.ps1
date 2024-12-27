echo DEPLOY
kubectl apply -f ../../../k8s/redis-pv.yaml
kubectl apply -f ../../../k8s/redis-pvc.yaml
kubectl apply -f ../../../k8s/service.yaml
kubectl apply -f ../../../k8s/deployment.yaml