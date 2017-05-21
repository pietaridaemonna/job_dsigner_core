#!/bin/bash
# Apache 2 license

install_node_DEBIAN_87() {
    apt-get install curl python-software-properties make gcc g++ libcairo2-dev libjpeg-dev libgif-dev -y
    curl -sL https://deb.nodesource.com/setup_7.x | bash -
    apt-get install nodejs -y
}

install_node_CENTOS_1611() {

    # NODE JS    
    yum install gcc-c++ make curl wget -y
    curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
    yum -y install nodejs
    firewall-cmd --zone=public --add-service=http
    firewall-cmd --zone=public --add-service=https
    npm config set strict-ssl false
    npm config set https-proxy http://proxy.houston.hp.com:8080
}


get_distro() {

	if [ -f /etc/redhat-release ]; then
		HOST_DISTRO='redhat'
        install_node_CENTOS_1611
	elif [ -f /etc/SuSE-release ]; then
		HOST_DISTRO="suse"
	elif [ -f /etc/debian_version ]; then
		HOST_DISTRO="debian" # NOT including Ubuntu!
        install_node_DEBIAN_87
	fi
}



######################################
# MAIN
######################################

get_distro

npm install 
npm start



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
