#!/bin/bash
# Apache 2 license

proxy="http://proxy"

echo -e "enter proxy, press enter for no proxy"
read prox

if [ -z "$prox" ]
then
	echo "using NO proxy"
else
	proxy=prox
	get_distro
	set_proxy_GENERIC
fi

set_proxy_DEBIAN_87() {
	# APT
	echo -e "Acquire::http::Proxy \"$proxy\";" >/etc/apt/apt.conf
	echo -e "Acquire::https::Proxy \"$proxy\";" >>/etc/apt/apt.conf
	echo -e "Acquire::ftp::Proxy \"$proxy\";" >>/etc/apt/apt.conf
}

set_proxy_CENTOS_1611() {
	# PROXY
	echo -e "proxy=$proxy" >>/etc/yum.conf
	export HTTPS_PROXY="$proxy"
	export HTTP_PROXY="$proxy"
}

set_proxy_GENERIC() {
	# WGET
	echo -e "http_proxy=$proxy" >/etc/wgetrc
	echo -e "https_proxy=$proxy" >>/etc/wgetrc
	echo -e "ftp_proxy=$proxy" >>/etc/wgetrc

	# GIT
	git config --global http.proxy $proxy

	# DOCKER
	echo "[Service]" >/etc/systemd/system/docker.service.d/http-proxy.conf
	echo "Environment=\"HTTP_PROXY=$proxy/\" \"HTTPS_PROXY=$proxy/\"" >>/etc/systemd/system/docker.service.d/http-proxy.conf

	# Node proxy
	npm config set strict-ssl false
	npm config set https-proxy $proxy

	echo -e "run export HTTP_PROXY=\"$proxy\""
	echo -e "run export HTTPS_PROXY=\"$proxy\""
}

get_distro() {

	if [ -f /etc/redhat-release ]; then
		HOST_DISTRO='redhat'
        set_proxy_CENTOS_1611
	elif [ -f /etc/SuSE-release ]; then
		HOST_DISTRO="suse"
	elif [ -f /etc/debian_version ]; then
		HOST_DISTRO="debian" # NOT including Ubuntu!
        set_proxy_DEBIAN_87
	fi
}



######################################
# MAIN
######################################


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
