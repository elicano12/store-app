#!/bin/bash

environment=$1
projectName="store-api"
projectSrc="dist"

echo "The project " $projectName " is going to be deployed in the " $environment " environment."

echo "Fetching updates..."
git pull

echo "Installing dependencies..."
npm install

echo "Killing the pm2 instance..."
rm -rf dist
pm2 delete $projectName

echo "Building the project..."
npm run build

echo "Starting the pm2 instance..."
pm2 start ecosystem.config.js

echo "$projectName deployed successfully"
