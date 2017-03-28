FROM centos:centos7.3.1611
MAINTAINER "peter.ducai" <peter.ducai@gmail.com>

RUN yum -y update && yum clean all & yum reinstall systemd
RUN curl -sL https://rpm.nodesource.com/setup_6.x | bash -


# JOB DSIGNER job_dsigner

# Create job_dsigner directory
RUN mkdir -p /usr/src/job_dsigner
WORKDIR /usr/src/job_dsigner

# Install job_dsigner dependencies
COPY package.json /usr/src/job_dsigner/
RUN npm install

# Bundle job_dsigner source
COPY . /usr/src/job_dsigner

EXPOSE 8080
CMD [ "npm", "start" ]