#!/bin/bash

action=$1; shift
services=($@)

echo ""

if [ "$action" == "build" ];
then
  if (( ${#services[@]} == 0 ))
  then
    action=""
  fi
  for service in ${services[@]}
    do
      if ! [[ -f Dockerfiles/$service.Dockerfile ]]
      then
        echo -e "Error! Dockerfiles/$service.Dockerfile doesn't exist"
        exit 1
      fi
    done
fi

case ${action} in
  build)
    echo "Building services..."
    for service in ${services[@]}
      do
        echo "Building image for $service"
        docker build -t teamcity-dd-$service -f Dockerfiles/$service.Dockerfile .
      done
  ;;
  run)
    echo "Running Docker Compose..."
    if (( ${#services[@]} == 0 ))
    then
      docker compose up -d
    else
      docker compose up -d ${services[@]}
    fi
  ;;
  --help)
    echo " ./build-tools.sh build ...args  - build docker images"
    echo " ./build-tools.sh run            - deploy images with docker compose"
    echo ""
    echo " ...args must correspond to 'arg.Dockerfile' in Dockerfiles/ and 'image: teamcity-dd-arg' in 'docker-compose.yml'"
    exit 1
  ;;
  *)
    echo -e " Invalid command"
    echo " See './build-tools.sh --help'"
    exit 1
esac
