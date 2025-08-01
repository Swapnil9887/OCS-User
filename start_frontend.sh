#!/bin/bash

# Set Node.js to use legacy OpenSSL provider for compatibility with older webpack
export NODE_OPTIONS="--openssl-legacy-provider"

# Start the Vue.js development server
echo "Starting OCS Example Frontend..."
echo "Using Node.js with legacy OpenSSL provider"
echo "Frontend will be available at: http://localhost:8080"
echo ""

npm run serve 