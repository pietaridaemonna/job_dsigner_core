#!/bin/bash
. ./hosts

virsh --connect $URL snapshot-create-as $1 default
virsh --connect $URL snapshot-list $1
