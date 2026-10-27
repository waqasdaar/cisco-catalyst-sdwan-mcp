# Cisco Catalyst SD-WAN MCP Server
# Uses Node.js 18 Alpine for minimal footprint
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source and build
COPY src/ ./src/
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --production

# Create non-root user (MCP security guidelines)
RUN addgroup -g 1001 -S sdwan && \
    adduser -S sdwan -u 1001 -G sdwan

RUN chown -R sdwan:sdwan /app
USER sdwan

# MCP servers typically use stdio transport; no port exposure needed for stdio mode
# When used with Cursor/IDE, the server communicates via stdin/stdout
CMD ["node", "build/index.js"]
