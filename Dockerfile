FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy application files
COPY . .

# Build React app
RUN cd client && npm run build

# Expose ports
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
