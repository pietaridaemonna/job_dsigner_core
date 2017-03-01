#!/bin/bash

# TERMINAL COLORS -----------------------------------------------------------------

NONE='\033[00m'
RED='\033[01;31m'
GREEN='\033[01;32m'
YELLOW='\033[01;33m'

# VALUES #############################################
word_counter=0
bash_values=()
function_names=()


# FUNCTIONS #########################################

function create_checksums {
	FILES=*.sh
	for f in $FILES
	do
  		sha256sum $f > ${f}.sum
	done
}

function check_funct {
	echo -e "${GREEN}"
	echo "================================================"
	echo " FUNCTIONS auditing"
	echo "================================================"
	echo -e "${NONE}"

	while read line
        do
                #take line and split it into array, first value is main! (aka group,client..etc)
                arrl=($(echo $line | tr " " "\n"))
		if [ -z "$line" ]; then
			echo "" > /dev/null
		else 
			case "${arrl[0]}" in
                	'#'*) #skip comment 
                        	;;
			'function') function_names[${#function_names[@]}]=${arrl[1]}
				;;
			'echo') #skip
				;;
	               	*)      #skip
				;;
                esac
		fi
        done <$1

	echo "found following ${#function_names[@]} functions:"
	echo "------------------------------------------------"
	local size=${#function_names[@]}
	for (( i=0; i<$size; i++))
	do	
		echo "${function_names[$i]}"		
	done
}

function check_unused_functions {
	echo -e "${RED}"
	echo "================================================"
	echo "UNUSED FUNCTIONS:"
	echo "================================================"
	echo -e "${NONE}"
	
	local size=${#function_names[@]}
	local fc=0
	
	for (( i=0; i<$size; i++))
	do	
		#echo "checking ${function_names[$i]}"
		fc=`tac $1 | grep '#MAIN' -m 1 -B 9999 | tac |grep ${function_names[$i]} | wc -l`
		if [[ $fc -lt 1 ]]; then
			echo "${function_names[$i]}"
		fi
	done	
	echo "================================================"
}

function check_values {
	echo -e "${GREEN}"
	echo "================================================"
	echo " VALUES auditing"
	echo "================================================"
	echo -e "${NONE}"

	while read line
        do
                #take line and split it into array, first value is main! (aka group,client..etc)
                arrl=($(echo $line | tr " " "\n"))
		if [ -z "$line" ]; then
			echo "" > /dev/null
		else 
			case "${arrl[0]}" in
                	'#'*) #skip comment 
                        	;;
			'function') echo "-------------------------------------------"
				echo "Found $word_counter VALUE definitions" 
				return
				;;
			'echo') #SKIP
				;;
	               	*)      arrIN=(${arrl[0]//=/ })
				echo "${arrIN}"
				bash_values[$word_counter]=${arrIN}
				((word_counter++))
				;;
                esac
		fi
        done <$1
}

function find_unused_values {
	echo -e "${RED}"
	echo "================================================"
	echo "UNUSED VALUES:"
	echo "================================================"
	echo -e "${NONE}"

	local unused_count=0
	
	for x in ${bash_values[@]}
	do
		unused=`cat $1 |grep $x| wc -l`
		if [[ $unused == "1" ]];
		then
			echo "$x"
			((unused_count++))
		fi
	done
	echo "-------------------------------------------"
	echo "found unused $unused_count values"
}


#MAIN ############################################
create_checksums 
check_values $1
find_unused_values $1
check_funct $1
check_unused_functions $1
