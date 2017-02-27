#!/bin/bash
POOL=kvm
DOMAIN_NAME=$1
RAM=1024
DISK_SIZE=8G
OS_VARIANT=rhel5
INTERFACE=br-ext

virsh vol-create-as $POOL $DOMAIN_NAME $DISK_SIZE --allocation $DISK_SIZE --format raw
VOL_PATH=$(virsh vol-list --pool $POOL | grep $DOMAIN_NAME | awk '{print $2}')

virt-install \
--connect qemu:///system \
--virt-type kvm \
--name $DOMAIN_NAME \
--ram $RAM \
--disk path=$VOL_PATH \
--pxe \
--network bridge=$INTERFACE \
--os-variant $OS_VARIANT \
--nographics \
