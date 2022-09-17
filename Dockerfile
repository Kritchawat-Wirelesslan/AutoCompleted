# syntax=docker/dockerfile:1
FROM node:13.12.0-alpine
WORKDIR /Autocomplete-async-search
ENV FLASK_APP=src/index.tsx
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
EXPOSE 5555
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
CMD ["npm", "start"]