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
# Purpose : tool for bash scripts autopsy
# Usage : bashtopsy.sh for more options
#

# TERMINAL COLORS --------------------------------------------------

NONE='\033[00m'
RED='\033[01;31m'
GREEN='\033[01;32m'
YELLOW='\033[01;33m'
BLACK='\033[30m'
BLUE='\033[34m'
VIOLET='\033[35m'
CYAN='\033[36m'
GREY='\033[37m'

# MAIN VALUES ------------------------------------------------------

function_names=()
function_values=()
function_descriptions=()

func_left_bracket=0
func_right_bracket=0

function examine {

	local lbra=0
	local rbra=0
	local infunc=0

	if [[ ! -s "$1" ]]; then
		echo "file $1 NOT FOUND or size 0"
		exit 1
	fi
	
	echo "MAIN"
	echo "|"
	while read line
        do
		#take line and split it into array, first value is main! (aka group,client..etc)
                arrl=($(echo $line | tr " " "\n"))

		if [[ $infunc == "0" ]]; then  #WE ARE IN MAIN 
			case "${arrl[0]}" in
                	'#'*) #skip comment
                        	;;
			'function') echo -e "|"
				echo -e "|---[${BLUE}function ${NONE}${YELLOW}${arrl[1]}${NONE}]"
				infunc=1
				echo "INSIDE"
				;;
			*'='*) 	echo -e "|-${GREY} ${arrl[0]} ${NONE}"
				;;
	               	*)      #skip
				;;
                	esac		
		else #WE ARE INSIDE FUNCTION
			lbra=$(( ${lbra}+$((`grep -o "{" <<<"$line" | wc -l`)) ))
			rbra=$(( ${lbra}+$((`grep -o "}" <<<"$line" | wc -l`)) ))			

			case "${arrl[0]}" in
                	'#'*) #skip comment
                        	;;
			*'='*) 	echo -e "|        |-${GREEN} ${arrl[0]} ${NONE}"
				;;
	               	*)      #skip
				;;
                	esac

			if [[ "$lbra" == "$rbra" ]]; then
				infunc=0  # outside of function
				lbra=0
				rbra=0
			fi	
		fi
        done <$1
}


function print_functions {

	local lbra=0
	local rbra=0
	local infunc=0

	if [[ ! -s "$1" ]]; then
		echo "file $1 NOT FOUND or size 0"
		exit 1
	fi
	
	while read line
        do
		#take line and split it into array, first value is main! (aka group,client..etc)
                arrl=($(echo $line | tr " " "\n"))


			case "${arrl[0]}" in
                	'#'*) #skip comment
                        	;;
			'function') echo -e "${YELLOW}${arrl[1]}${NONE}"
				;;
			*'='*) 	#skip
				;;
	               	*)      #skip
				;;
                	esac		
        done <$1
}


function check_param_braces {
	echo -e "${GREEN}BRACES TEST:${NONE} The braces are required to avoid conflicts with pathname expansion."
}

function check_unused_functions {
	somval1=43
	echo -e "${GREEN}FUNCTIONS TEST:${NONE} Unused functions make your script less readable and using more memory."
}

function check_unused_values {
	someval1=444
	echo -e "${GREEN}VALUES TEST:${NONE} Unused values make your script less readable and using more memory."
}













function version {
	echo "---------------------------------------------------------------------------------"
        echo "__________               .__  ___________                         "
        echo "\______   \_____    _____|  |_\__    ___/___ ______  _________.__."
        echo " |    |  _/\__  \  /  ___/  |  \|    | /  _ \\____ \/  ___<   |  |"
        echo " |    |   \ / __ \_\___ \|   Y  \    |(  <_> )  |_> >___ \ \___  |"
        echo " |______  /(____  /____  >___|  /____| \____/|   __/____  >/ ____|"
	echo "        \/      \/     \/     \/             |__|       \/ \/"
        echo "---------------------------------------------------------------------------------"
        echo "Bash autopsy tool from https://sourceforge.net/projects/bashtools/"
        echo "---------------------------------------------------------------------------------"
} 

case "$1" in
examine) version
	examine $2
        ;;
printfunctions) print_functions $2
	;;
version) version
        ;;
*)
        echo "usage: $0 (print_function_tree | examine <file_for_autopsy> | report <file_for_autopsy> <report>|printfunctions <file>)"
        exit 1
esac

exit $?
