# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.2.0

################################################################################
# Stage 1: Build frontend.
FROM node:${NODE_VERSION}-alpine AS frontend

WORKDIR /frontend

COPY frontend/package*.json .

RUN npm install

COPY frontend .

RUN npm run build

# ################################################################################
# Stage 2: Run backend server.
FROM node:${NODE_VERSION}-alpine AS backend

# Use production node environment by default.
ENV NODE_ENV=production

# Set working directory for app.
WORKDIR /usr/src/cruise-connect

# Copy package and package-lock to install dependencies.
COPY backend/package*.json .
RUN npm install

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY backend .
COPY --from=frontend /frontend/dist ./dist

# Get certificates
# COPY certs certs
# RUN update-ca-certificates

# Expose the port that the application listens on.
EXPOSE 80 443

# Run the application.
CMD [ "npm", "run", "start" ]
