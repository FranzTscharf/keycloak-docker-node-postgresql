# Gateway

## Getting started:
execute:
```
cd gateway

docker-compose up --build
#to stop the conatiner agin
docker-compose down
```

## User interface:

![KeyCloak Login](./media/1.png)
![Node app with keycloak api key](./media/2.png)
![postman login request to get api key from keycloak](./media/3.png)

## node API endpoint:

host: http://localhost:3000/login

user: user

pass: 31nh9fwhf9hw94bf

## keycloak Instance:

host: http://localhost:8080

user: admin

pass: zoTeS58932h2394h23



## PostgreSQL Instance:

POSTGRES_USER: keycloak_user

POSTGRES_PASSWORD: 7xlfDFkLP234324
