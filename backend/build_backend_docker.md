# Docker Image Setup

Este guia explica como construir e executar uma imagem Docker a partir de um Dockerfile.

## Pré-requisitos
- Docker instalado ([Download Docker](https://www.docker.com/get-started))
- Acesso ao terminal/linha de comando

## Passos Básicos

### 1. Construir a Imagem
Execute no diretório que contém o `Dockerfile`:
```bash
docker build -t nome-da-imagem .
```

### 2. Rodar o Docker-compose

```bash
docker compose up
```
- Observação: É necessário subir primeiro o banco para subir o back-end

### 3. Rodar a imagem do backend
```bash
docker run -p 8080:8080 --network postgres-net nome-da-imagem:latest
```

###
