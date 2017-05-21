!#/bin/bash

#https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/
#https://github.com/dockerfile

get_values(){
	echo -e "what is base image? ( centos, opensuse, debian )"
	read image
	echo -e "path to script/app you want to dockerize"
	read script
	echo -e "destination where script/app should be placed ( /srv /usr/bin )"
	read script

}

writeDockerFile() {
	# set base image and script you want to dockerize
    echo -e "FROM ${image}" > Dockerfile
    echo -e "COPY ${script} ${destination}" >> Dockerfile
    echo -e "ENTRYPOINT [\"/${script}\"]" >> Dockerfile
    echo -e "CMD [\"default_cmd\"]" >> Dockerfile
	echo -e "" >> Dockerfile
	# add labels
	echo -e "LABEL cont.version=\"0.0.1-beta\"" >> Dockerfile
	echo -e "LABEL cont.vendor=\"DXC Technology\"" >> Dockerfile
	echo -e "LABEL cont.release-date=\""+`date +"%m_%d_%Y"`+"\"" >> Dockerfile
	echo -e "LABEL cont.is-production=\"NO\"" >> Dockerfile
	echo -e "" >> Dockerfile
	# add user/group if you dont want to run as ROOT
	echo -e "RUN groupadd -r ${user} && useradd -r -g ${user} ${user}" >> Dockerfile
}


get_distro() {

	if [ -f /etc/redhat-release ]; then
		HOST_DISTRO='redhat'
        install_node_CENTOS_1611
	elif [ -f /etc/SuSE-release ]; then
		HOST_DISTRO="suse"
	elif [ -f /etc/debian_version ]; then
		HOST_DISTRO="debian" # NOT including Ubuntu!
        install_node_DEBIAN_87
	fi
}



######################################
# MAIN
######################################

get_distro

get_values

echo -e "Do you want to create Dockerfile now? (Y/N)"

read buildit

if [ buildit == "Y" ]
	then
		writeDockerFile



if [[ $# -lt 1 ]]; then
	print_usage
fi

for i in "$@"; do
	case $i in
		--help) print_usage ;;
		*)
			echo "invalid option ${i}!!!"
			print_usage
			exit 1
			;;
	esac
done

exit $?
