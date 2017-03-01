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
# Purpose : linux firewall
# Usage : daemonWall.sh for more options
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
SERVER_IP="10.10.112.199"


IPT=/sbin/iptables
MODPROBE=/sbin/modprobe
debtor_web="94.136.136.22:8000"

activated_functions=()
activated_comments=()

# High priority source ports, SSH DNS HTTP HTTPS VoIP
HIGHPRIOPORTSRC="22 53 80 8080 443 3478 5060 5061"

# forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward
sysctl -p /etc/sysctl.conf

#FUNCTIONS #################################################################


#####################
# Redirect debtors  #
#####################
function tc_ban_debtors {
	activated_functions[${#activated_functions[@]}]="tc_ban_debtors"
	activated_comments[${#activated_comments[@]}]="redirect debt clients to website with debt notice"
	echo "running tc_ban_debtors"

	local debtor_ip=$1
	if [ -s "config/ban_debtor.set" ]; then
		for i in $( cat config/ban_debtor.set );
		do
			$IPT -t nat -A PREROUTING -p tcp -s $i -j DNAT --to-destination $debtor_web
		done
	else
		mkdir config
		touch config/ban_debtor.set;
	fi
}	


#########################
# load iptables modules #
#########################
function ipt_load_modules {
	activated_functions[${#activated_functions[@]}]="ipt_load_modules"
	activated_comments[${#activated_comments[@]}]="load iptables modules"
	echo "running ipt_load_modules"

	/sbin/depmod -a
	$MODPROBE ip_conntrack
	$MODPROBE iptable_nat
	$MODPROBE ip_conntrack
	$MODPROBE ip_conntrack_ftp
	$MODPROBE iptable_nat
	$MODPROBE ip_nat_ftp
	$MODPROBE ipt_MASQUERADE
}

#########################
# set up masquarade     #
#########################
function ipt_masquarade {
	activated_functions[${#activated_functions[@]}]="ipt_masquarade"
	activated_comments[${#activated_comments[@]}]="load masquarade"
	echo "running ipt_masquarade"

	#By default, the IPv4 policy in Red Hat Enterprise Linux kernels disables support for IP forwarding. This prevents machines that run Red Hat Enterprise Linux from functioning as dedicated edge 
	sysctl -w net.ipv4.ip_forward=1

	$MODPROBE ipt_MASQUERADE # If this fails, try continuing anyway

	$IPT -t nat -A POSTROUTING -o $EXT_IF -j MASQUERADE
	$IPT -A FORWARD -i $EXT_IF -o $INT_IF -m state --state RELATED,ESTABLISHED -j ACCEPT
	$IPT -A FORWARD -i $INT_IF -o $EXT_IF -j ACCEPT

	$IPT -t nat -A PREROUTING -i $EXT_IF -p tcp --dport 80 -j DNAT --to-destination $SERVER_IP
	#If you have a default policy of DROP in your FORWARD chain, you must append a rule to forward all incoming HTTP requests so that destination NAT routing is possible
	$IPT -A FORWARD -i $EXT_IF -p tcp --dport 80 -d $SERVER_IP -j ACCEPT
}

function ipt_dnat {
	#Destination NAT with netfilter is commonly used to publish a service from an internal RFC 1918 network to a publicly accessible IP
	activated_functions[${#activated_functions[@]}]="ipt_dnat"
	activated_comments[${#activated_comments[@]}]="load DNAT"
	echo "running ipt_dnat"

	#ip addr add <<PUBLIC_IP>> dev <<firewall_external_interface>>

	#$IPT -t nat -A PREROUTING -d $INET_IP -p tcp --dport 80 -j DNAT --to-destination $HTTP_IP
	# Setup DNAT rules for SSH
	#$IPT -t nat -I PREROUTING -i $EXT_IF -p tcp -m state --state NEW --dport 22 -j DNAT --to-destination 10.1.1.16:22

	#full NAT with SNAT and DNAT
	#iptables -t nat -A PREROUTING -d 205.254.211.17 -j DNAT --to-destination 192.168.100.17
	#iptables -t nat -A POSTROUTING -s 192.168.100.17 -j SNAT --to-destination 205.254.211.17
}

function ipt_allow_internal_ssh {
	activated_functions[${#activated_functions[@]}]="ipt_dnat"
	activated_comments[${#activated_comments[@]}]="load DNAT"
	echo "running ipt_dnat"

	$IPT -A INPUT -i $INT_IF -p tcp --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $INT_IF -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT

	#forward port 22 to internal server
}


function ipt_allow_external_ssh {
	activated_functions[${#activated_functions[@]}]="ipt_dnat"
	activated_comments[${#activated_comments[@]}]="load DNAT"
	echo "running ipt_dnat"

	iptables -A OUTPUT -o $EXT_IF -p tcp --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
	iptables -A INPUT -i $EXT_IF -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT

	#forward port 22 to internal server
}



#######################################
# set priority for common services    #
#######################################
function ipt_DSCP {
	#This is a target that changes the DSCP (Differentiated Services Field) marks inside a packet. The DSCP target is able to set any DSCP value inside a TCP packet, which is a way of telling routers the priority of the packet in question. For more information about DSCP, look at the RFC 2474 - Definition of the Differentiated Services Field (DS Field) in the IPv4 and IPv6 Headers RFC document.
	#more at http://www.cisco.com/en/US/tech/tk543/tk757/technologies_tech_note09186a00800949f2.shtml
	activated_functions[${#activated_functions[@]}]="ipt_DSCP"
	activated_comments[${#activated_comments[@]}]="set priority/DSCP in packets"
	echo "running ipt_DSCP"

	$IPT -t mangle -A FORWARD -p tcp -m multiport --dports 22,25,80,143,443,993 -j DSCP --set-dscp 1
}

################################
# allow common public services #
################################
function ipt_allow_public {
	activated_functions[${#activated_functions[@]}]="ipt_allow_public"
	activated_comments[${#activated_comments[@]}]="allow public services"
	echo "running ipt_allow_public"
	
	#allow set HIGH PRIORITY
	#When you are allowing incoming connections from outside world to multiple ports, instead of writing individual rules for each and every port, you can combine them together using the multiport extension
	$IPT -A INPUT -i $EXT_IF -p tcp -m multiport --dports 22,25,80,143,443,993 -j ACCEPT
	$IPT -A INPUT -i $INT_IF -p tcp -m multiport --dports 22,25,80,143,443,993 -j ACCEPT
	$IPT -A OUTPUT -t mangle -p tcp -m multiport --dports 22,25,80,143,443,993 -j TOS --set-tos Minimize-Delay
	$IPT -A OUTPUT -t mangle -p tcp -m multiport --dports 22,25,80,143,443,993 -j TOS --set-tos Maximize-Throughput
}

#################################
# allow established connections #
#################################
function ipt_allow_established {
	activated_functions[${#activated_functions[@]}]="ipt_allow_established"
	activated_comments[${#activated_comments[@]}]="allow established connections"
	echo "running ipt_allow_established"

	$IPT -A OUTPUT -o $INT_IF -j ACCEPT
	$IPT -A INPUT -i $INT_IF -m state --state ESTABLISHED,RELATED -j ACCEPT
}



#############
# allow NTP #
#############
function ipt_allow_ntp {
	### load connection-tracking modules
	activated_functions[${#activated_functions[@]}]="ipt_allow_ntp"
	activated_comments[${#activated_comments[@]}]="allow NTP server"
	echo "running ipt_allow_ntp"

	$IPT -I OUTPUT -p udp -m udp -m multiport --dports 123 -m state --state NEW -j ACCEPT
	$IPT -I INPUT -p udp -m udp -m multiport --dports 123 -m state --state NEW -j ACCEPT
	$IPT -I FORWARD -p udp -m udp -m multiport --dports 123 -m state --state NEW -j ACCEPT
}

#@TODO
################
# allow HTTP   #
################
function ipt_allow_HTTP {
	### load connection-tracking modules
	activated_functions[${#activated_functions[@]}]="ipt_allow_HTTP"
	activated_comments[${#activated_comments[@]}]="allow Apache/Nginx or other HTTP server"
	echo "running ipt_allow_HTTP"

	$IPT -A INPUT -p tcp -s 0/0 --sport 1024:65535 -d $SERVER_IP --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -p tcp -s $SERVER_IP --sport 80 -d 0/0 --dport 1024:65535 -m state --state ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -p tcp -s $SERVER_IP --sport 1024:65535 -d 0/0 --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A INPUT -p tcp -s 0/0 --sport 80 -d $SERVER_IP --dport 1024:65535 -m state --state ESTABLISHED -j ACCEPT	
}



#@TODO
#################
# allow https   #
#################
function ipt_allow_HTTPS {
	### load connection-tracking modules
	activated_functions[${#activated_functions[@]}]="ipt_allow_HTTPS"
	activated_comments[${#activated_comments[@]}]="allow secure Apache/Nginx or other HTTPS server"
	echo "running ipt_allow_HTTPS"

	$IPT -A OUTPUT -p tcp -s $SERVER_IP --sport 1024:65535 -d 0/0 --dport 443 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A INPUT -p tcp -s 0/0 --sport 443 -d $SERVER_IP --dport 1024:65535 -m state --state ESTABLISHED -j ACCEPT	
}


function ipt_allow_samba {
	activated_functions[${#activated_functions[@]}]="ipt_allow_samba"
	activated_comments[${#activated_comments[@]}]="allow Samba server"
	echo "running ipt_allow_samba"
	
	$IPT -A INPUT -p udp -m udp --dport 137 -j ACCEPT
	$IPT -A INPUT -p udp -m udp --dport 138 -j ACCEPT
	$IPT -A INPUT -m state --state NEW -m tcp -p tcp --dport 139 -j ACCEPT
	$IPT -A INPUT -m state --state NEW -m tcp -p tcp --dport 445 -j ACCEPT
}


################
# allow ftp    #
################
function ipt_allow_ftp {
	activated_functions[${#activated_functions[@]}]="ipt_allow_ftp"
	activated_comments[${#activated_comments[@]}]="allow ftp"
	echo "running ipt_allow_ftp"

	# FTP
	# allow all ftpd incoming connections
	$IPT -A INPUT -p tcp -d 0/0 --dport 21 -j ACCEPT

	# Enable active ftp transfers/data
	$IPT -A INPUT -p tcp -s 0/0 --sport 20 -m state --state ESTABLISHED,RELATED -j ACCEPT
	$IPT -A INPUT -p tcp -d 0/0 --dport 20 -m state --state ESTABLISHED,RELATED -j ACCEPT

	# Enable passive ftp transfers
	#$IPT -A INPUT -p tcp -s 0/0 --sport 1024:65535 --dport 1024:65535 -m state --state ESTABLISHED,RELATED -j ACCEPT
}


#@TODO
#
# allow NFS
#
function ipt_allow_nfs {
	### load connection-tracking modules
	activated_functions[${#activated_functions[@]}]="ipt_allow_nfs"
	activated_comments[${#activated_comments[@]}]="allow NFS server"
	echo "running ipt_allow_nfs"

	modprobe ip_conntrack_rpc_tcp
	modprobe ip_conntrack_rpc_udp
	modprobe ipt_rpc

	#By accepting new connections to the sunrpc port (port 111), and by tracking ``getport'' requests (by the RPC module), netfilter can dynamically track RPC traffic, by accepting packets that are related to the ``getport'' request.
	iptables -A INPUT -j ACCEPT -p tcp -m state --state NEW -m tcp --dport 111
	iptables -A INPUT -j ACCEPT -p udp -m state --state NEW -m udp --dport 111
	iptables -A INPUT -m rpc -j ACCEPT
}

#
# allow DHCP queries from LAN
#
function ipt_allow_dhcp {
	activated_functions[${#activated_functions[@]}]="ipt_allow_dhcp"
	activated_comments[${#activated_comments[@]}]="allow DHCP queries from LAN"
	echo "running ipt_allow_dhcp"

	$IPT -I INPUT -i $INT_IF -p udp --dport 67:68 --sport 67:68 -j ACCEPT
	$IPT -I OUTPUT -o $INT_IF -p udp --dport 67:68 --sport 67:68 -j ACCEPT
}

####################
# flush all rules  #
####################
function ipt_flush {
	activated_functions[${#activated_functions[@]}]="ipt_flush"
	activated_comments[${#activated_comments[@]}]="flush all iptables rules"
	echo -e "${RED}flushing all rules${NONE}"

	$IPT -X
	$IPT -F
	$IPT -t nat -F
	$IPT -t nat -X
	$IPT -t mangle -F
	$IPT -t mangle -X
	$IPT -P INPUT ACCEPT
	$IPT -P FORWARD ACCEPT
	$IPT -P OUTPUT ACCEPT
}

#################################
# set default policy to DROP    #
#################################
function ipt_default {
	activated_functions[${#activated_functions[@]}]="ipt_default"
	activated_comments[${#activated_comments[@]}]="set default (and secure) iptables policy to drop all packets"
	echo "running ipt_allow_default"
	
	#default rules
	$IPT -P INPUT DROP
	$IPT -P FORWARD DROP
	$IPT -P OUTPUT ACCEPT #change to ACCEPT if you trust your internal users
}

################################################
# allow internal eth1 to talk to external eth0 #
################################################
function ipt_allow_internal_to_external {
	activated_functions[${#activated_functions[@]}]="ipt_allow_internal_to_external"
	activated_comments[${#activated_comments[@]}]="allow internal $INT_IF to talk to external $EXT_IF"
	echo "running ipt_allow_internal_to_external"

	$IPT -A FORWARD -i $INT_IF -o $EXT_IF -j ACCEPT
}

#################
# ANTISPOOF     #
#################
function ipt_antispoof { 
	activated_functions[${#activated_functions[@]}]="ipt_antispoof"
	activated_comments[${#activated_comments[@]}]="set antispoof (reserved IANA IP addresses cannot talk from external network)"
	echo "running ipt_antispoof"

	# Drop any traffic from IANA-reserved IPs.
	$IPT -A INPUT -s 0.0.0.0/7 -j DROP
	$IPT -A INPUT -s 2.0.0.0/8 -j DROP
	$IPT -A INPUT -s 5.0.0.0/8 -j DROP
	$IPT -A INPUT -s 7.0.0.0/8 -j DROP
	$IPT -A INPUT -s 10.0.0.0/8 -j DROP
	$IPT -A INPUT -s 23.0.0.0/8 -j DROP
	$IPT -A INPUT -s 27.0.0.0/8 -j DROP
	$IPT -A INPUT -s 31.0.0.0/8 -j DROP
	$IPT -A INPUT -s 36.0.0.0/7 -j DROP
	$IPT -A INPUT -s 39.0.0.0/8 -j DROP
	$IPT -A INPUT -s 42.0.0.0/8 -j DROP
	$IPT -A INPUT -s 49.0.0.0/8 -j DROP
	$IPT -A INPUT -s 50.0.0.0/8 -j DROP
	$IPT -A INPUT -s 77.0.0.0/8 -j DROP
	$IPT -A INPUT -s 78.0.0.0/7 -j DROP
	$IPT -A INPUT -s 92.0.0.0/6 -j DROP
	$IPT -A INPUT -s 96.0.0.0/4 -j DROP
	$IPT -A INPUT -s 112.0.0.0/5 -j DROP
	$IPT -A INPUT -s 120.0.0.0/8 -j DROP
	$IPT -A INPUT -s 169.254.0.0/16 -j DROP
	$IPT -A INPUT -s 172.16.0.0/12 -j DROP
	$IPT -A INPUT -s 173.0.0.0/8 -j DROP
	$IPT -A INPUT -s 174.0.0.0/7 -j DROP
	$IPT -A INPUT -s 176.0.0.0/5 -j DROP
	$IPT -A INPUT -s 184.0.0.0/6 -j DROP
	$IPT -A INPUT -s 192.0.2.0/24 -j DROP
	$IPT -A INPUT -s 197.0.0.0/8 -j DROP
	$IPT -A INPUT -s 198.18.0.0/15 -j DROP
	$IPT -A INPUT -s 223.0.0.0/8 -j DROP
	$IPT -A INPUT -s 224.0.0.0/3 -j DROP
}


#################################
# protection against SYN FLOOD  #
#################################
function ipt_SYN_flood_protection { #CHECK!!! Logging
	activated_functions[${#activated_functions[@]}]="ipt_SYN_flood_protection"
	activated_comments[${#activated_comments[@]}]="protection against SYN flood (aka DDOS attack)"
	echo "running ipt_syn_flood_protection"

	$IPT -N TCP_FLAGS
	$IPT -N BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ACK,FIN FIN             -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ACK,PSH PSH             -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ACK,URG URG             -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags FIN,RST FIN,RST         -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags SYN,FIN SYN,FIN         -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags SYN,RST SYN,RST         -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ALL ALL                 -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ALL NONE                -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ALL FIN,PSH,URG         -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ALL SYN,FIN,PSH,URG     -j BADFLAGS
        $IPT -A TCP_FLAGS -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j BADFLAGS
}

##############################
# allow internal DNS traffic #
##############################
function ipt_allow_DNS_internal {
	activated_functions[${#activated_functions[@]}]="ipt_allow_DNS_internal"
	activated_comments[${#activated_comments[@]}]="allow internal DNS queries and RNDC"
	echo "running ipt_allow_dns_internal"

	$IPT -A OUTPUT -p udp -o $INT_IF -m multiport --dport 53,953 -j ACCEPT
	$IPT -A INPUT -p udp -i $INT_IF -m multiport --sport 53,953 -j ACCEPT
	$IPT -A OUTPUT -p tcp -o $INT_IF -m multiport --dport 53,953 -j ACCEPT
	$IPT -A INPUT -p tcp -i $INT_IF -m multiport --sport 53,953 -j ACCEPT
}

###############################
# allow external DNS traffic  #
###############################
function ipt_allow_DNS_external {
	activated_functions[${#activated_functions[@]}]="ipt_allow_DNS_external"
	activated_comments[${#activated_comments[@]}]="allow external DNS queries and RNDC"
	echo "running ipt_allow_dns_external"	

	$IPT -A OUTPUT -p udp -o $EXT_IF -m multiport --dport 53,953 -j ACCEPT
	$IPT -A INPUT -p udp -i $EXT_IF -m multiport --sport 53,953 -j ACCEPT
	$IPT -A OUTPUT -p tcp -o $EXT_IF -m multiport --dport 53,953 -j ACCEPT
	$IPT -A INPUT -p tcp -i $EXT_IF -m multiport --sport 53,953 -j ACCEPT
}

#############################
# allow LOOPBACK interface  #
#############################
function ipt_allow_loopback {
	activated_functions[${#activated_functions[@]}]="ipt_allow_loopback"
	activated_comments[${#activated_comments[@]}]="allow loopback interface (some services requires it)"
	echo "running ipt_allow_loopback"

	$IPT -A INPUT -i lo -j ACCEPT
	$IPT -A OUTPUT -o lo -j ACCEPT
}

##########################
# allow flowd 9995 port  #
##########################
function ipt_allow_flowd {
	activated_functions[${#activated_functions[@]}]="ipt_allow_flowd"
	activated_comments[${#activated_comments[@]}]="allow loopback interface (some services requires it)"
	echo "running ipt_allow_flowd"
	
}

#
# allow SMTP (sendmail,qmail.. etc)
#
function ipt_allow_SMTP {
	activated_functions[${#activated_functions[@]}]="ipt_allow_SMTP"
	activated_comments[${#activated_comments[@]}]="allow SMTP (mail) thru firewall"
	echo "running ipt_allow_smtp"

	$IPT -A INPUT -i $EXT_IF -p tcp --dport 25 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $EXT_IF -p tcp --sport 25 -m state --state ESTABLISHED -j ACCEPT

	$IPT -A INPUT -i $INT_IF -p tcp --dport 25 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $INT_IF -p tcp --sport 25 -m state --state ESTABLISHED -j ACCEPT

	# port 587 is the preferred port for mail submission
}

#
# allow IMAP
#
function ipt_allow_IMAP {
	activated_functions[${#activated_functions[@]}]="ipt_allow_IMAP"
	activated_comments[${#activated_comments[@]}]="allow IMAP and IMAPS thru firewall"
	echo "running ipt_allow_imap"

	#The following rules allow IMAP/IMAP2 traffic.
	$IPT -A INPUT -i $EXT_IF -p tcp --dport 143 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $EXT_IF -p tcp --sport 143 -m state --state ESTABLISHED -j ACCEPT
	$IPT -A INPUT -i $INT_IF -p tcp --dport 143 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $INT_IF -p tcp --sport 143 -m state --state ESTABLISHED -j ACCEPT

	#The following rules allow IMAPS traffic.
	$IPT -A INPUT -i $EXT_IF -p tcp --dport 993 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $EXT_IF -p tcp --sport 993 -m state --state ESTABLISHED -j ACCEPT
	$IPT -A INPUT -i $INT_IF -p tcp --dport 993 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $INT_IF -p tcp --sport 993 -m state --state ESTABLISHED -j ACCEPT
}

############################################################
# block all NULL packets                                   #
############################################################
function ipt_drop_null {
	activated_functions[${#activated_functions[@]}]="ipt_drop_null"
	activated_comments[${#activated_comments[@]}]="drop NULL packets"
	echo "running ipt_drop_null"

	$IPT -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
}

############################################################
# block all XMAS packets                                   #
############################################################
function ipt_drop_XMAS {
	activated_functions[${#activated_functions[@]}]="ipt_drop_XMAS"
	activated_comments[${#activated_comments[@]}]="block all XMAS packets"
	echo "running ipt_allow_xmas"

	#$IPT -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
	$IPT -A INPUT -p tcp --tcp-flags ALL FIN,PSH,URG -j DROP
}

############################################################
# block all INVALID packets                                #
############################################################
function ipt_drop_invalid {
	activated_functions[${#activated_functions[@]}]="ipt_drop_invalid"
	activated_comments[${#activated_comments[@]}]="Drop all invalid packets"
	echo "running ipt_drop_invalid"

	$IPT -A INPUT -m state --state INVALID -j DROP
	$IPT -A FORWARD -m state --state INVALID -j DROP
	$IPT -A OUTPUT -m state --state INVALID -j DROP
}

############################################################
# block SMURF attack                                       #
############################################################
function ipt_drop_smurf {
	activated_functions[${#activated_functions[@]}]="ipt_drop_smurf"
	activated_comments[${#activated_comments[@]}]="block SMURF attack"
	echo "running ipt_drop_smurf"

	$IPT -A INPUT -p icmp -m icmp --icmp-type address-mask-request -j DROP
	$IPT -A INPUT -p icmp -m icmp --icmp-type timestamp-request -j DROP
	#$IPT -A INPUT -p icmp -m icmp -j DROP
}

############################################################
# drop excessive RST packets                               #
############################################################
function ipt_drop_RST {
	activated_functions[${#activated_functions[@]}]="ipt_drop_RST"
	activated_comments[${#activated_comments[@]}]="Drop excessive RST packets to avoid smurf attacks"
	echo "running ipt_drop_rst"

	$IPT -A INPUT -p tcp -m tcp --tcp-flags RST RST -m limit --limit 2/second --limit-burst 2 -j ACCEPT
}

############################################################
# allow POP3 traffic                                       #
############################################################
function ipt_allow_POP3 {
	activated_functions[${#activated_functions[@]}]="ipt_allow_POP3"
	activated_comments[${#activated_comments[@]}]="allow POP3 and POP3S"	
	echo "running ipt_allow_pop3"

	#The following rules allow POP3 traffic.
	$IPT -A INPUT -i eth0 -p tcp --dport 110 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o eth0 -p tcp --sport 110 -m state --state ESTABLISHED -j ACCEPT

	#The following rules allow POP3S traffic.
	$IPT -A INPUT -i eth0 -p tcp --dport 995 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o eth0 -p tcp --sport 995 -m state --state ESTABLISHED -j ACCEPT
}

############################################################
# block all portscans                                      #
############################################################
function ipt_block_portscan {
	activated_functions[${#activated_functions[@]}]="ipt_block_portscan"
	activated_comments[${#activated_comments[@]}]="Anyone who tried to portscan us is locked out for an entire day"
	echo "running ipt_block_portscan"

	$IPT -A INPUT   -m recent --name portscan --rcheck --seconds 86400 -j DROP
	$IPT -A FORWARD -m recent --name portscan --rcheck --seconds 86400 -j DROP
}


###################################
# allow internal MySQL connection #
###################################
function ipt_allow_MySQL_internal { 
	activated_functions[${#activated_functions[@]}]="ipt_allow_mysql_internal"
	activated_comments[${#activated_comments[@]}]="allow internal connections to mysql server"
	echo "running ipt_allow_mysql_internal"

	$IPT -A INPUT -i $INT_IF -p tcp --dport 3306 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $INT_IF -p tcp --sport 3306 -m state --state ESTABLISHED -j ACCEPT
}

###################################
# allow external MySQL connection #
###################################
function ipt_allow_MySQL_external { 
	activated_functions[${#activated_functions[@]}]="ipt_allow_mysql_external"
	activated_comments[${#activated_comments[@]}]="allow external connections to mysql server"
	echo "running ipt_allow_mysql_external"

	$IPT -A INPUT -i $EXT_IF -p tcp --dport 3306 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $EXT_IF -p tcp --sport 3306 -m state --state ESTABLISHED -j ACCEPT
}

######################
# drop NetBIOS noise #
######################
function ipt_drop_NetBIOS { 
	activated_functions[${#activated_functions[@]}]="ipt_drop_NetBIOS"
	activated_comments[${#activated_comments[@]}]="drop NetBIOS noise, log and drop"
	echo "running ipt_drop_NetBIOS"

	$IPT -A INPUT -i eth0 -p tcp -s 0/0 --sport 137:139 -j LOG --log-level debug --log-prefix "IPTABLES NETBIOS-IN: "
	$IPT -A INPUT -i eth0 -p tcp -s 0/0 --sport 137:139 -j DROP
}



#
# allow ORACLE db connection 
#
function ipt_allow_oracle {
	activated_functions[${#activated_functions[@]}]="ipt_allow_oracle"
	activated_comments[${#activated_comments[@]}]="allow connections to oracle server"
	echo "running ipt_allow_oracle"

	#The ports required for the web browser connection to Oracle VM Manager are: 7001, 7002 and 15901.
	#The ports used by the Oracle VM Servers to connect to Oracle VM Manager are: 7001, 7002 and 54321.
	#Oracle VM Manager, in turn, connects to the Oracle VM Servers through port 8899 for Oracle VM Agent communication,
	#and port 6900 and up for secure VNC tunneling to virtual machines (one port per VM).

	$IPT -A INPUT -p tcp --dport 1521 -j ACCEPT 
	$IPT -A OUTPUT -p tcp --sport 1521 -j ACCEPT

	iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 7001 -j ACCEPT
	iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 7002 -j ACCEPT
	iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 15901 -j ACCEPT
	iptables -A INPUT -m state --state NEW -m udp -p udp --dport 123 -j ACCEPT
	iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 54321 -j ACCEPT #allow Oracle VM Manager
}

############################################################
# allows rsync only from a specific network                #
############################################################
function ipt_allow_rSync { #FIX
	activated_functions[${#activated_functions[@]}]="ipt_allow_rsync"
	activated_comments[${#activated_comments[@]}]="allow rsync to copy files to/from server"
	echo "running ipt_allow_rsync"

	$IPT -A INPUT -i $INT_IF -p tcp --dport 873 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $INT_IF -p tcp --sport 873 -m state --state ESTABLISHED -j ACCEPT

	$IPT -A INPUT -i $EXT_IF -p tcp --dport 873 -m state --state NEW,ESTABLISHED -j ACCEPT
	$IPT -A OUTPUT -o $EXT_IF -p tcp --sport 873 -m state --state ESTABLISHED -j ACCEPT
}


############################################################
# Allow Nagios NRPE Client Access from Nagios Server       #
############################################################
function ipt_allow_Nagios { 
	activated_functions[${#activated_functions[@]}]="ipt_allow_Nagios"
	activated_comments[${#activated_comments[@]}]="Allow Nagios NRPE Client Access from Nagios Server"
	echo "running ipt_allow_Nagios"

	$IPT  -A INPUT -p tcp -m tcp --dport 5666 -m state --state NEW,ESTABLISHED -j ACCEPT
}

############################################################
# allow PING/ICMP inside to outside                        #
############################################################
function ipt_allow_PING_in2out {
	activated_functions[${#activated_functions[@]}]="ipt_allow_PING_in2out"
	activated_comments[${#activated_comments[@]}]="allow ping from inside to outside"
	echo "running ipt_allow_PING_in2out"

	$IPT -A INPUT  -i $INT_IF -p icmp -j ACCEPT
	$IPT -A OUTPUT -p icmp --icmp-type echo-request -j ACCEPT
	$IPT -A INPUT -p icmp --icmp-type echo-reply -j ACCEPT
}

############################################################
# allow PING/ICMP outside to inside                        #
############################################################
function ipt_allow_PING_out2in {
	activated_functions[${#activated_functions[@]}]="ipt_allow_PING_out2in"
	activated_comments[${#activated_comments[@]}]="allow ping from outside to inside"
	echo "running ipt_allow_PING_out2in"

	$IPT -A INPUT  -i $INT_IF -p icmp -j ACCEPT
	$IPT -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
	$IPT -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT
}

#############
# allow NIS #
#############
function ipt_allow_NIS {
	activated_functions[${#activated_functions[@]}]="ipt_allow_NIS"
	activated_comments[${#activated_comments[@]}]="allow NIS thru firewall"
	echo "running ipt_allow_nis"

	$IPT -A INPUT -p tcp -m multiport --dport 111,853,850 -j ACCEPT
	$IPT -A INPUT -p udp -m multiport --dport 111,853,850 -j ACCEPT
}

function ipt_allow_logging {
	activated_functions[${#activated_functions[@]}]="ipt_allow_logging"
	activated_comments[${#activated_comments[@]}]="allow iptables logging"
	echo "running ipt_allow_logging"
	
	iptables -N LOGGING
	iptables -A INPUT -j LOGGING
	iptables -A LOGGING -m limit --limit 2/min -j LOG --log-prefix "IPTables Packet Dropped: " --log-level 7
	iptables -A LOGGING -j DROP
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

function version {
	echo "---------------------------------------------------------------------------------"
        echo "       __                               _       __      ____"
        echo "  ____/ /___ ____  ____ ___  ____  ____| |     / /___ _/ / /"
        echo " / __  / __ \`/ _ \/ __ \`__ \/ __ \/ __ \ | /| / / __ \`/ / /"
        echo "/ /_/ / /_/ /  __/ / / / / / /_/ / / / / |/ |/ / /_/ / / /"
        echo "\__,_/\__,_/\___/_/ /_/ /_/\____/_/ /_/|__/|__/\__,_/_/_/"
        echo "---------------------------------------------------------------------------------"
        echo "DaemonWall iptables firewall. https://sourceforge.net/projects/bashtools/"
        echo "---------------------------------------------------------------------------------"
} 

# HERE ENABLE OR DISABLE FEATURES!!!!!
function start {
	
	ipt_flush
	version
	ipt_load_modules

	ipt_default  #must be first!

	#tc_ban_debtors
	ipt_masquarade
	#ipt_dnat
	#ipt_DSCP
	ipt_allow_public
	ipt_allow_established
	#ipt_allow_ntp
	#ipt_allow_HTTP
	#ipt_allow_HTTPS
	#ipt_allow_samba
	#ipt_allow_ftp
	#ipt_allow_nfs
	ipt_allow_dhcp
	ipt_allow_internal_to_external
	#ipt_antispoof
	#ipt_SYN_flood_protection
	#ipt_allow_DNS_internal
	#ipt_allow_DNS_external
	ipt_allow_loopback
	#ipt_allow_flowd
	#ipt_allow_SMTP
	#ipt_allow_IMAP
	#ipt_drop_null
	#ipt_drop_XMAS
	#ipt_drop_invalid
	#ipt_drop_smurf
	#ipt_drop_RST
	#ipt_allow_POP3
	#ipt_block_portscan
	#ipt_allow_MySQL_internal
	#ipt_allow_MySQL_external
	#ipt_drop_NetBIOS
	#ipt_allow_oracle
	#ipt_allow_rSync
	#ipt_allow_Nagios
	ipt_allow_PING_in2out
	ipt_allow_PING_out2in
	#ipt_allow_NIS
	#ipt_allow_logging
	#ipt_allow_internal_ssh
	#ipt_allow_external_ssh

	list_activated_features
}       

case "$1" in
start) start
        ;;
stop)   ipt_flush
	ipt_masquarade
        ;;        
restart) start
        ;;

status) list_activated_features
	echo -e "${GREEN}= IPTABLES STATUS =========================================${NONE}";
	iptables -L -n
	echo -e "${GREEN}===========================================================${NONE}";
        ;;
version) version
        ;;
*)	version
	echo "usage: $0 (start|stop|restart|status|version)"
        exit 1
esac

exit $?



 
  
              



 




