#!/bin/bash
POOL=kvm
DOMAIN_NAME=$1
CPUS=1
RAM=1024
DISK_SIZE=8
FORMAT=qcow2

#OS_VARIANT=rhel5.4
#LOCATION="http://192.168.8.3/mirrors/centos/5/os/x86_64/"
#LOCATION="http://192.168.8.3/mirrors/rhel/5/"
#KS=http://192.168.8.3/ks/centos5.cfg
#KS=http://192.168.8.3/ks/rhel5.cfg

#OS_VARIANT=rhel6
#LOCATION="http://192.168.8.3/mirrors/centos/6/os/x86_64/"
#LOCATION="http://192.168.8.3/mirrors/rhel/6/"
#KS=http://192.168.8.3/ks/centos6.cfg
#KS=http://192.168.8.3/ks/rhel6.cfg

OS_VARIANT=ubuntuprecise
LOCATION="http://192.168.8.3/mirrors/ubuntu/dists/precise/main/installer-amd64/"
KS=http://192.168.8.3/ks/ubuntu.cfg

BR1=br-ext
BR2=br-int
BR3=br-sec
BR4=br-isol

virsh vol-create-as $POOL $DOMAIN_NAME "$DISK_SIZE"G --allocation "$DISK_SIZE"G --format $FORMAT
VOL_PATH=$(virsh vol-list --pool $POOL | grep $DOMAIN_NAME | awk '{print $2}')

virt-install \
--connect qemu:///system \
--virt-type kvm \
--name $DOMAIN_NAME \
--ram $RAM \
--vcpus=$CPUS \
--disk=$VOL_PATH,size=$DISK_SIZE,bus=virtio,cache=writeback,sparse=true,format=$FORMAT \
--network bridge=$BR2,model=virtio \
--os-variant $OS_VARIANT \
--location=$LOCATION \
--extra-args "ks=$KS ksdevice=eth0 console=tty0 console=ttyS0,115200"
