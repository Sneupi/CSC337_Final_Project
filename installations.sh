#!/bin/bash
sudo apt-get update
sudo apt install nodejs -y
sudo apt install npm -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh -y
sudo apt-get install docker-compose-plugin -y