FROM node:slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY ./package.json ./package-lock.json ./

RUN npm install --dev
