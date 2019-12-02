# Personal Training Playground to learn Go

This project is a training playground for me to learn Golang. It goes beyond the simple Hello World or ToDo List

## Infra

The infrastructure is deployed using terraform. It creates A Kubernetes Cluster on my personal GCP project

## Services

The services are written in Go and uses protobufs to describe their APIs. POSTGRES is the DB.

## Frontend

The frontend is written in TypeScript and uses lit-element for the UI. The business logic is separate and the Mediator oversees the UI and Model sync. 
