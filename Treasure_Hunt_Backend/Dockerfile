FROM node:20-slim

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create uploads dir (fallback, images go to Cloudinary)
RUN mkdir -p uploads

# HuggingFace Spaces requires port 7860
EXPOSE 7860

# Start the server
CMD ["node", "src/server.js"]
