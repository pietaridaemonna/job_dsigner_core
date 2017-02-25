#!/bin/bash

#FEDORA 25

#remove original/old packages
sudo dnf -y remove docker docker-common container-selinux
sudo dnf -y remove docker-selinux

#add repo of new docker pkgs
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager \
    --add-repo \
    https://docs.docker.com/engine/installation/linux/repo_files/fedora/docker.repo

sudo dnf makecache fast
sudo dnf -y install docker-engine



#PROXY
sudo mkdir -p /etc/systemd/system/docker.service.d
echo "[Service] \
Environment=\"HTTP_PROXY=http://proxy.example.com:80/\"" >> /etc/systemd/system/docker.service.d/http-proxy.conf

#reload all
sudo systemctl daemon-reload
sudo systemctl restart docker

sudo docker pull centos #to check 