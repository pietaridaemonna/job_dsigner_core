#!/bin/bash
DOMAIN_NAME=$1
CPUS=1
RAM=1024
DISK_SIZE=8
FORMAT=qcow2
POOL=SSD250

#virt-install --os-variant list

#OS_VARIANT=rhel5.4
#LOCATION="http://repo.cloud/mirrors/centos/5/os/x86_64/"
#LOCATION="http://repo.cloud/mirrors/rhel/5/"
#KS=http://repo.cloud/ks/centos5.cfg
#KS=http://repo.cloud/ks/rhel5.cfg

#OS_VARIANT=rhel6
#LOCATION="http://repo.cloud/mirrors/centos/6/os/x86_64/"
#LOCATION="http://repo.cloud/mirrors/rhel/6/"
#KS=http://repo.cloud/ks/centos6.cfg
#KS=http://repo.cloud/ks/rhel6.cfg
#EXTRA_ARGS="auto=true hostname=precise interface=eth0 $PRE_CONF console=tty0 console=ttyS0,115200"

#OS_VARIANT=ubuntuprecise
#LOCATION="http://repo.cloud/mirrors/ubuntu/dists/precise-updates/main/installer-amd64/"
#PRE_CONF="url=http://repo.cloud/ks/ubuntu-vm.cfg"
#EXTRA_ARGS="auto=true hostname=$1 interface=eth0 $PRE_CONF console=tty0 console=ttyS0,115200"

OS_VARIANT=ubuntutrusty
LOCATION="http://kr.archive.ubuntu.com/ubuntu/dists/trusty-updates/main/installer-amd64/"
PRE_CONF="url=http://repo.cloud/ubuntu-vm.cfg"
EXTRA_ARGS="auto=true hostname=$1 interface=eth0 $PRE_CONF console=tty0 console=ttyS0,115200"

BR1=ovs-ext
BR2=ovs-int1
BR3=ovs-int3
BR4=ovs-int4

virsh vol-create-as $POOL $DOMAIN_NAME "$DISK_SIZE"G --allocation "$DISK_SIZE"G --format $FORMAT
VOL_PATH=$(virsh vol-list --pool $POOL | grep $DOMAIN_NAME | awk '{print $2}')

## Installation using PXE
#virt-install \
#--connect $URL \
#--virt-type kvm \
#--name $DOMAIN_NAME \
#--ram $RAM \
#--vcpus=$CPUS \
#--disk=$VOL_PATH,size=$DISK_SIZE,bus=virtio,cache=writeback,sparse=true,format=$FORMAT \
#--network bridge=$BR1,model=virtio \
#--os-variant $OS_VARIANT \
#--vnc \
#--pxe \

## Installation using local location
sudo virt-install \
--virt-type kvm \
--name $DOMAIN_NAME \
--ram $RAM \
--vcpus=$CPUS \
--disk=$VOL_PATH,size=$DISK_SIZE,bus=virtio,cache=writeback,sparse=true,format=$FORMAT \
--network=$BR1 \
--os-variant $OS_VARIANT \
--location=$LOCATION \
--graphics none \
--extra-args "$EXTRA_ARGS"



