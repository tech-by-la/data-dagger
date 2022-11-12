#!/bin/bash

projects=('client')

build_action=$ACTION

case ${build_action} in
    build)
    echo "Building projects..."
    for project in ${projects[@]}
        do
            echo "building image for $project"
            docker build -t teamcity-dd-$project -f Dockerfiles/$project.Dockerfile .
        done
    ;;
    run)
    echo "Running Docker Container..."
    docker compose up -d
    ;;
    *)
esac
