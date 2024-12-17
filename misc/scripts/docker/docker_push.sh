echo BUILD AND PUSH 
docker build -t userapi:latest ./userApi
docker tag userapi snaxx78/userapi:latest
docker push snaxx78/userapi:latest