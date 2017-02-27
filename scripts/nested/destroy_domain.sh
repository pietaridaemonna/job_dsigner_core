#!/bin/bash

virsh snapshot-delete $1 default
virsh destroy $1
virsh undefine $1
virsh vol-delete $1 --pool ssd
virsh vol-delete $1 --pool disk
