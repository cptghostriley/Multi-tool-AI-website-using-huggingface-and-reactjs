#!/bin/bash
# Startup script for Render deployment
# Check if we're in the right directory
if [ -d "server" ]; then
    echo "Found server directory, starting from root"
    cd server
    npm start
elif [ -f "index.js" ]; then
    echo "Already in server directory, starting directly"
    npm start
else
    echo "Error: Cannot find server directory or index.js"
    ls -la
    exit 1
fi
