#!/bin/bash

touch /etc/yum.repos.d/mongodb-org-3.4.repo
mongorepo = "[mongodb-org-3.4] \
name=MongoDB Repository \
baseurl=https://repo.mongodb.org/yum/redhat/7Server/mongodb-org/3.4/x86_64/ \
gpgcheck=1 \
enabled=1 \
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc"

echo "$mongorepo" > /etc/yum.repos.d/mongodb-org-3.4.repo

sudo yum install -y mongodb-org

semanage port -a -t mongod_port_t -p tcp 27017
firewall-cmd --zone=public --add-port=27017/tcp --permanent
firewall-cmd --reload


systemctl start mongod
systemctl enable mongod

CLEANUP:

sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongo