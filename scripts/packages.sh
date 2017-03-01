#!/bin/bash

apt-get update

function deb_install_commons {
	apt-get install p7zip-full tcpdump nmap traceroute vim openssh-server mc links rsync ethtool locate sysstat screen lm-sensors

	sensors-detect
	service module-init-tools restart
}

function deb_install_router {
	apt-get update
	apt-get upgrade
	apt-get install quagga 
}

function deb_install_oracle_java {
	sudo add-apt-repository ppa:webupd8team/java
	sudo apt-get update
	sudo apt-get install oracle-java7-installer
}

function deb_install_server {
	sudo apt-get update
	sudo apt-get install bridge-utils iptables ipset xtables-addons-common iptables-dev
}

function deb_install_ubuntu_desktop {
	apt-get install ubuntu-desktop
}

function deb_install_kvm {
	egrep -c '(vmx|svm)' /proc/cpuinfo
	cat /sys/hypervisor/properties/capabilities #XEN
	apt-get install qemu-kvm libvirt-bin ubuntu-vm-builder bridge-utils 

	#RHEL
	yum install libvirt libvirt-python python-virtinst
}

function deb_install_kvm_GUI {
	apt-get install virt-manager vmware-view-client virt-goodies
	yum install virt-manager
}

function deb_install_development {
	apt-get install gcc g++ cmake llvm clang git mercurial subversion 
}
