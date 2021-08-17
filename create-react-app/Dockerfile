## Build environment
# Pull node image from docker hub
FROM node:13.12.0-alpine as build

# Set working directory
WORKDIR /app

# Add node_modules.bin to path
ENV PATH /app/node_modules.bin:$PATH

# Copy package.json & package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm ci
# RUN npm install react-scripts -g

# Copy all (not listed in .dockerignore) to container
COPY . ./

# Build app
RUN npm run build



## Production environment
# Pull Nginx image from docker hub
# FROM nginx:stable-alpine
FROM arm64v8/nginx

# Copy contense of the build folder to nginex root
COPY --from=build /app/build /usr/share/nginx/html

# Open port 80
# EXPOSE 80

# Start Nginx service
CMD ["nginx", "-g", "daemon off;"]
