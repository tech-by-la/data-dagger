#!/bin/bash

services=('client')

action=$1

case ${action} in
    build)
    echo "Building projects..."
    for service in ${services[@]}
        do
            echo "building image for $service"
            docker build -t teamcity-dd-$service -f Dockerfiles/$service.Dockerfile .
        done
    ;;
    run)
    echo "Running Docker Compose..."
    docker compose up -d
    ;;
    *)
    echo -e "Usage:"
    echo " ./build-tools.sh build  - build docker images"
    echo " ./build-tools.sh run    - deploy images with docker compose"
    echo ""
    echo "Remember edit the services array at the top of this script to include all the services that you want to build"
    echo "The name of the service must correspond to a Dockerfile in the Dockerfiles folder"
    echo "Example: myservice.Dockerfile"
    echo "It must also correspond to the image name in docker-compose.yml"
    echo "Example: image: teamcity-dd-myservice"
    exit 1
esac
