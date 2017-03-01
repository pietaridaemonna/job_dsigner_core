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
# Purpose : tools for Mikrotik devices
# Usage : mikrotik.sh for more options
#

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

#
# set up loadbalancing for HTTPS
#
function list_neighbors { # user, host, password
	activated_functions[${#activated_functions[@]}]="list_neighbors_detail"
	activated_comments[${#activated_comments[@]}]="print all neighbors (simple view)"
	echo "running list_neighbors_detail"

	ssh $1@$2 'ip neighbor print'
}

#
# set up loadbalancing for HTTPS
#
function list_neighbors_detail { # user, host, password
	activated_functions[${#activated_functions[@]}]="list_neighbors_detail"
	activated_comments[${#activated_comments[@]}]="print all neighbors (detail view)"
	echo "running list_neighbors_detail"

	ssh $1@$2 'ip neighbor print detail'
}


#
# list reg table interfaces 
#
function list_reg_table_interface {
	activated_functions[${#activated_functions[@]}]="list_reg_table"
	activated_comments[${#activated_comments[@]}]="list registration table"
	echo "running list_reg_table"

	ssh $1@$2 'interface wireless registration-table print stats'|grep -wi --color interface
}

#
# list reg table CCQ
#
function list_reg_table_ccq {
	activated_functions[${#activated_functions[@]}]="list_reg_table"
	activated_comments[${#activated_comments[@]}]="list registration table"
	echo "running list_reg_table"

	ssh $1@$2 'interface wireless registration-table print stats' |grep -wi --color 'interface\|ccq'
}

#
# list registration table with full detail
#
function list_reg_table_detail {
	activated_functions[${#activated_functions[@]}]="list_reg_table"
	activated_comments[${#activated_comments[@]}]="list registration table"
	echo "running list_reg_table"

	ssh $1@$2 'interface wireless registration-table print stats'
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
        echo "        .__ __                   __  .__ __   "
        echo "  _____ |__|  | _________  _____/  |_|__|  | __"
        echo " /     \|  |  |/ /\_  __ \/  _ \   __\  |  |/ /"
        echo "|  Y Y  \  |    <  |  | \(  <_> )  | |  |    < "
        echo "|__|_|  /__|__|_ \ |__|   \____/|__| |__|__|_ \\"
	echo "      \/        \/                           \/"
        echo "---------------------------------------------------------------------------------"
        echo "tools for Mikrotik devices. https://sourceforge.net/projects/bashtools/"
        echo "---------------------------------------------------------------------------------"
	echo "usage: ./mikrotik.sh (list_neighbors <user> <IPaddress>|list_neighbors_detail <user> <IP>|list_reg_table_interface <user> <IP>|list_reg_table_ccq <user> IP|list_reg_table_detail <user> <IP>)"
	echo "---------------------------------------------------------------------------------"
} 

# HERE ENABLE OR DISABLE FEATURES!!!!!
function start {
	version
}       

case "$1" in
start) start
        ;;
list_neighbors)   list_neighbors  $2 $3
        ;;        
list_neighbors_detail) list_neighbors_detail $2 $3
        ;;
list_reg_table_interface) list_reg_table $2 $3
        ;;
list_reg_table_ccq) list_reg_table_ccq $2 $3
	;;
list_reg_table_detail) list_reg_table_detail $2 $3
        ;;
version) version
        ;;
*) version
        exit 1
	;;
esac

exit $?



 
  
              



 




