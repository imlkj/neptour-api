# Multi-stage Dockerfile
# - target 'dev' builds an image with devDependencies (nodemon) and runs the app with nodemon
# - target 'prod' builds a smaller production image with only production dependencies

ARG NODE_VERSION=22.20.0

#############################
# Development image (includes nodemon)
#############################
FROM node:${NODE_VERSION}-bullseye-slim AS dev
WORKDIR /usr/src/app

# Install build tools and dependencies required by native modules (sharp, etc.)
RUN apt-get update && \
	apt-get install -y --no-install-recommends python3 build-essential libc6-dev libvips-dev ca-certificates && \
	rm -rf /var/lib/apt/lists/*

# Install optional native modules like sharp (npm must be invoked via RUN)
RUN npm install --include=optional sharp


# Copy package manifests and install all deps (including devDeps so nodemon is available)
COPY package*.json ./
RUN npm ci --silent

# Copy source and run in development mode
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "start"]

#############################
# Production image
#############################
# Use Debian-slim base to avoid Alpine-native build issues for modules like sharp
FROM node:${NODE_VERSION}-bullseye-slim AS prod
WORKDIR /usr/src/app

# Install minimal prerequisites for native modules if needed
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy only package manifests and install production dependencies
COPY package*.json ./
RUN npm ci --production --silent

# Copy the rest of the application
COPY --chown=node:node . .

ENV NODE_ENV=production
EXPOSE 3000

# Run as non-root user for security
USER node

# In production we run with plain node (not nodemon)
CMD ["node", "server.js"]
