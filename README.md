## Description

This repository represents RuBAC Proof of concept with 2 workflows implemented.

## Docker Installation
For this project setup we will use:

```bash
docker 
```
and
```bash
docker compose
```

Here is a guide how to do it.
https://docs.docker.com/engine/install

## Setup

```bash
# creating docker image
$ docker compose build --no-cache
```

## Running the app

```bash
# starting container for already created image
$ docker compose up -d

```

## Running tests

```bash
# unit tests
$ docker compose exec api yarn test

# integration tests
$ docker compose exec api yarn test:int

# test coverage
$ docker compose exec api yarn test:cov
```

## How to test service manually

By adding these parameters in header we can test service: 
"user-id" and "x-forwarded-for".

```bash
# Here is an example:
$ curl http://localhost:80/admin/setting -H "user-id: 1" -H "x-forwarded-for: 100.100.100.1"
```

***user-id = 1*** returns us ***SUPER_ADMIN role***

***user-id = 2*** returns us ***ADMIN role***

***user-id = 3 or no id*** returns ***BASIC role***

### Application behavior 

If RubacService grants access to url (returns value true)
Response will be 'Hello world!' with status 200.

If RubacService denies access to url (returns value false)
Response will be 'Not Authorized!' with status 401.
