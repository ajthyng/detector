#!/bin/sh

# Build the project
echo "Building detector container..."
docker build --tag athyng/detector --platform linux/arm/v7 .

echo "Detector container built, pushing to Docker Hub..."

docker push athyng/detector