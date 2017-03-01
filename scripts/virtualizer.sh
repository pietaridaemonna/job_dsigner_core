#!/bin/bash

#
# Author : Peter Ducai <peter.ducai@gmail.com>
# Homepage : https://sourceforge.net/projects/bashtools/
# License : BSD http://en.wikipedia.org/wiki/BSD_license
# Copyright (c) 2013, Peter Ducai
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met: 
# 
# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer. 
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution. 
# 
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# Purpose : tools for KVM virtualization
# Usage : virtualizer.sh for more options
#

####### VIRSH COMMANDS #####################################
#help	 print help
#list	 list domains
#create	 create a domain from an XML file
#start	 start a previously created inactive domain
#destroy	 destroy a domain
#define	 define (but do not start) a domain from an XML file
#domid	 convert a domain name or UUID to domain id
#domuuid	 convert a domain name or id to domain UUID
#dominfo	 domain information
#domname	 convert a domain id or UUID to domain name
#domstate	 domain state
#quit	 quit this interactive terminal
#reboot	 reboot a domain
#restore	 restore a domain from a saved state in a file
#resume	 resume a domain
#save	 save a domain state to a file
#shutdown	 gracefully shutdown a domain
#suspend	 suspend a domain
#undefine	 undefine an inactive domain

# TERMINAL COLORS -----------------------------------------------------------------

NONE='\033[00m'
RED='\033[01;31m'
GREEN='\033[01;32m'
YELLOW='\033[01;33m'
BLACK='\033[30m'
BLUE='\033[34m'
VIOLET='\033[35m'
CYAN='\033[36m'
GREY='\033[37m'

#================================================

EXT_IF="eth0"
INT_IF="eth1"
IPT=/sbin/iptables
MODPROBE=/sbin/modprobe
debtor_web="94.136.136.22:8000"

activated_functions=()
activated_comments=()


#FUNCTIONS #################################################################

#@TODO
#
# set up loadbalancing for HTTPS
#
function ipt_loadbalance_https {
	activated_functions[${#activated_functions[@]}]="ipt_loadbalance_https"
	activated_comments[${#activated_comments[@]}]="loadbalance HTTPs server"
	echo "running ipt_loadbalance_https"

	}

#
# List activated features of daemonWall
#
function list_activated_features {
	echo -e "${GREEN}= daemonWall status of ACTIVATED features ===================${NONE}"; 
	echo ""
	for (( i=0; i<$((${#activated_functions[@]})); i++ ))
	do
		echo -e "[active] ${GREEN}${activated_functions[i]}${NONE} : ${activated_comments[i]}"
	done
	echo ""
	echo -e "${GREEN}=============================================================${NONE}";
}

#MAIN ###########################################

function stop {
	ipt_flush
}

function version {
	echo "---------------------------------------------------------------------------------"
        echo "      .__         __               .__  .__     "
        echo "___  _|__|_______/  |_ __ _______  |  | |__|_______ ___________ "
        echo "\  \/ /  \_  __ \   __\  |  \__  \ |  | |  \___   // __ \_  __ \\"
        echo " \   /|  ||  | \/|  | |  |  // __ \|  |_|  |/    /\  ___/|  | \/"
        echo "  \_/ |__||__|   |__| |____/(____  /____/__/_____ \\___  >__| "
	echo "                                 \/              \/    \/"
        echo "---------------------------------------------------------------------------------"
        echo "tools for KVM. https://sourceforge.net/projects/bashtools/"
        echo "---------------------------------------------------------------------------------"
} 

# HERE ENABLE OR DISABLE FEATURES!!!!!
function start {
	version
	ipt_load_modules
	ipt_flush
	ipt_default
	ipt_masquarade
}       

case "$1" in
list)	echo "-- ACTIVE -----------------------" 
	virsh list
	echo "-- INACTIVE ---------------------"
	virsh list --inactive
        ;;
list_active)	echo "-- ACTIVE -----------------------" 
	virsh list
        ;;
list_ianctive)	echo "-- INACTIVE ---------------------"
	virsh list --inactive
        ;;
info)   virsh dominfo $1
	virsh vcpuinfo $1
        ;;        
restart) start
        ;;

status) list_activated_features
	echo -e "${GREEN}= IPTABLES STATUS =========================================${NONE}";
	iptables -L -n
	echo -e "${GREEN}===========================================================${NONE}";
        ;;
version) virsh version
        ;;
*)
        echo "usage: $0 (list|list_active|list_inactive|info <domain>|reboot <domain>|)"
        exit 1
esac

exit $?



 
  
              



 




