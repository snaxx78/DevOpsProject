echo CLEAN K8S
kubectl delete deployment redis-deployment
kubectl delete deployment userapi-deployment
kubectl delete service redis
kubectl delete service userapi
kubectl delete pvc redis-pvc
kubectl delete pv redis-pv