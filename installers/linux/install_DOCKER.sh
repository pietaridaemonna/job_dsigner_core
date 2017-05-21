#!/bin/bash

#apache 2 license

install_docker_DEBIAN_87() {
    # Remove old docker
    apt-get remove docker docker-engine -y 
    apt-get install apt-transport-https ca-certificates curl software-properties-common build-essential vim nmap tcpdump mlocate openssl -y
    #curl -fsSL 
    wget https://download.docker.com/linux/debian/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian \
        $(lsb_release -cs) \
        stable"
        apt-get update -y
    apt-get install docker-ce -y
}

install_docker_CENTOS_1611() {

    # DOCKER
    yum install -y yum-utils
    yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    yum makecache fast
    yum install docker-ce -y
    echo -e "Docker \e[5m\e[92mINSTALLED\e[0m ...wait for service restart"
}


pull_images(){
	systemctl daemon-reload
    systemctl enable docker
    systemctl restart docker

    echo -e "Docker \e[5m\e[92mPULLING IMAGES\e[0m ...this can take a while"
    docker pull centos
    docker pull opensuse
    docker pull debian
}


get_distro() {
    if [ -f /etc/redhat-release ]; then
		HOST_DISTRO='redhat'
        install_docker_CENTOS_1611
	elif [ -f /etc/SuSE-release ]; then
		HOST_DISTRO="suse"
	elif [ -f /etc/debian_version ]; then
		HOST_DISTRO="debian" # NOT including Ubuntu!
        install_docker_DEBIAN_87
	fi
}



######################################
# MAIN
######################################

get_distro
pull_images


if [[ $# -lt 1 ]]; then
	print_usage
fi

for i in "$@"; do
	case $i in
		--help) print_usage ;;
		*)
			echo "invalid option ${i}!!!"
			print_usage
			exit 1
			;;
	esac
done

exit $?
