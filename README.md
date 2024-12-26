## DevOps Project

Web application developed as part of the DevOps project for the 4th year of engineering studies at ECE Paris.


## State of the project

| Subject                                                        | Code  | DONE |
|----------------------------------------------------------------|:-------:|:------:|
| Enriched web application with automated tests                 | APP   | ✅    |
| Continuous Integration and Continuous Delivery (and Deployment)| CICD  | ❌    |
| Infrastructure as code using Ansible                          | IAC   | ❌    |
| Containerisation with Docker                                   | D     | ❌    |
| Orchestration with Docker Compose                             | DC    | ❌    |
| Orchestration with Kubernetes                                 | KUB   | ❌    |
| Service mesh using Istio                                       | IST   | ❌    |
| Accurate project documentation in README.md file              | DOC   | ✅    |


## Prerequisite

To run the project you'll need to have the following programs installed on your computer :
* [git](https://git-scm.com/downloads)
* [NodeJS](https://nodejs.org/en) and [NPM](https://docs.npmjs.com/cli/v10/configuring-npm/install)
* [chocolatey](https://chocolatey.org/install) if you want to install npm and node easily on windows
* [docker](https://docs.docker.com/get-started/get-docker/)
* [redis](https://redis.io/resources/mit-report-genai/)
* [minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download) and [kubctl](https://kubernetes.io/docs/tasks/tools/)
* [virtualbox](https://www.virtualbox.org/wiki/Downloads) or [vmware](https://www.vmware.com/)

# APP USAGE

The very principle of the web application is a REST API allowing the user to use CRUD functionalities using a REDIS database.  
After downloading the project use `npm install` to install the packages because they aren't present and need to be installed manually.  
If you cant install REDIS on your computer you can run the following command `docker compose up -d` from the misc folder and it will use a docker image of REDIS.  

## USERAPI

To run the application you need to be in the ./userApi folder and run the following command :  
`npm start`  
It will start the server at the following address : > http://localhost:3000  

![alt text](.\images\image.png)  

# LIST OF REQUEST :

To test a request you can use curl or Postman (Postman is easier to use)  

1. Create a user and register it in the REDIS database

By using a POST request to http://localhost:3000/user you can create an user and register it into the REDIS database. You only need to provide the following JSON body  
``` 
{
  "username": "snaxx",
  "firstname": "thibault",
  "lastname": "leonardon"
}
```

And the API will reply with : 
`{ "status": "success", "msg": "OK" }`
\n


2. GET the username of all users in the database

By using a GET request to http://localhost:3000/user/keys you will receive the list of username in the database. The API will reply with something like this :  
``` 
{
    "status": "success",
    "msg": [
        "toche",
        "user",
        "snaxx"
    ]
}
```
\n

3. GET user information by username

By using a GET request to http://localhost:3000/user/:username you will receive the firstname and lastname for the username gaved in the request. The API will reply with something like this :  
``` 
{
    "status": "success",
    "msg": {
        "firstname": "thibault",
        "lastname": "leonardon"
    }
}
```
\n

4. DELETE user information by username

By using a DELETE request to http://localhost:3000/user/:username you will a user from the REDIS database. The API will reply with something like this :  
``` 
{
    "status": "success",
    "msg": 1
}
```

5. Health status

We also created a health endpoint that can give you health information of the wep app buy doing a GET request on http://localhost:3000/health. The API will reply with something like this :  
``` 
{
    "uptime": 662.1771877,
    "status": "OK",
    "timestamp": 1734129294991
}
```
\n
## API SWAGGER 
We also set up a swagger thanks to swagger-JSdoc which allows you to test the API at the following url: http://localhost:3000/api-docs He looks like this : ![alt text](../images/swagger.png)  

## API TESTS

We made a serie of tests verify that the API's working well you can try them by running the following command : `npm run test`
And it will show you the results of all the tests :
![alt text](../images/tests.png)  
You can see that in the tests we try things that can 'break' the app, like creating an existing user, deleting a non existing user ect.  
If all is green that's significate that all is working.
