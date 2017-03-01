#!/bin/bash

if [ -f /etc/lsb-release ]; then
    . /etc/lsb-release
    DISTRO=$DISTRIB_ID
elif [ -f /etc/debian_version ]; then
    DISTRO=Debian
    # XXX or Ubuntu
elif [ -f /etc/redhat-release ]; then
    DISTRO="Red Hat"
    # XXX or CentOS or Fedora
else
    DISTRO=$(uname -s)
fi

# cat /etc/*version
# cat /proc/version #linprocfs/version for FreeBSD when "linux" enabled
# cat /etc/*release
# uname -rv


# #!/usr/bin/env bash

# echo "Finding Debian/ Ubuntu Codename..."

# CODENAME=`cat /etc/*-release | grep "VERSION="`
# CODENAME=${CODENAME##*\(}
# CODENAME=${CODENAME%%\)*}

# echo "$CODENAME"
# # => saucy, precise, lucid, wheezy, squeeze



#sed -n -e '/PRETTY_NAME/ s/^.*=\|"\| .*//gp' /etc/os-release

echo "FOUND ${DISTRO}..............."