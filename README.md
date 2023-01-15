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
$ docker compose build
```

## Running the app

```bash
# starting container for already created image
$ docker compose up

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

