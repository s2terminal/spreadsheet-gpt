FROM node:slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g @google/clasp
