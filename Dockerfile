#
# Copyright 2016 (C) Diglias AB
#
# @author jonas
# 
#
FROM centos:centos6
MAINTAINER Jonas jonas@diglias.com

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN yum install -y epel-release
# Install Node.js and npm
RUN yum install -y nodejs npm

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install --production

# Copy application code
COPY bin /src/bin
COPY public /src/public
COPY routes /src/routes
COPY views /src/views
COPY app.js /src/app.js
COPY diglias.js /src/diglias.js
COPY diglias-conf.json /src/diglias-conf.json

# The app runs on port 3000 over SSL
EXPOSE  3000

# Start the node server
WORKDIR /src
CMD ["npm", "start"]
