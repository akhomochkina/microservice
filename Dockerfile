# Stage 0: Install the base dependancies
FROM node:16.15-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS dependencies

# Metadata about your image
LABEL maintainer="Anastasia Khomochkina" \
    description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false \
    NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./ \
    package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

#################################################################################

# Stage 1: 
FROM node:16.15-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS build

# Install curl
RUN apk add --no-cache curl=~7.83.1

# Use /app as our working directory
WORKDIR /app

COPY --from=dependencies /app /app/

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
    CMD curl --fail localhost:8080 || exit 1