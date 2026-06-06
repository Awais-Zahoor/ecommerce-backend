# Use Node.js base image
FROM node:20-slim

# Create and define the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port (matches process.env.PORT || 8080 in server.js)
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
