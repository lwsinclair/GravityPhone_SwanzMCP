#!/bin/bash

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    # Try to start MongoDB using systemd
    if command -v systemctl > /dev/null; then
        sudo systemctl start mongod
    else
        # If systemd is not available, try to start MongoDB directly
        mongod --fork --logpath /tmp/mongodb.log --dbpath /tmp/mongodb
    fi
else
    echo "MongoDB is already running."
fi

# Start the MCP server
echo "Starting MCP server..."
node build/index.js

# Instructions for adding to Cursor
echo ""
echo "To add this MCP server to Cursor:"
echo "1. Open Cursor"
echo "2. Go to Cursor Settings > Features > MCP"
echo "3. Click '+ Add New MCP Server'"
echo "4. Fill out the form:"
echo "   - Name: Grey Swan LLM Safety Challenge"
echo "   - Type: stdio"
echo "   - Command: node $(pwd)/build/index.js"
echo ""
echo "After adding the server, you should see your tools listed under 'Available Tools'."
echo "If not, try clicking the refresh button in the top right corner of the MCP server section." 