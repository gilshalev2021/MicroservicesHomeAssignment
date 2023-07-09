FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Create a directory where our app will be placed
RUN mkdir -p /app

# Copy dependency definitions
COPY package*.json ./

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Build the production-ready UI
RUN npm run build

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]