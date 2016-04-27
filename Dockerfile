#
# Copyright 2016 (C) Diglias AB
#
# @author jonas
# 
#
FROM crusaider/baseimage-node:0.1.0
MAINTAINER Jonas jonas@diglias.com

# Install app dependencies
COPY eapi-client /src/eapi-client
COPY package.json /src/package.json
RUN cd /src; npm install --production

# Copy application code
COPY bin /src/bin
COPY public /src/public
COPY routes /src/routes
COPY views /src/views
COPY app.js /src/app.js
COPY diglias-conf.json /src/diglias-conf.json

# The app runs on port 3000 over SSL
EXPOSE  3000

# Register the app as a service with my_init
RUN mkdir /etc/service/sample-app && \
    echo "#!/bin/sh\ncd /src\nexec npm start" > /etc/service/sample-app/run && \
    chmod +x /etc/service/sample-app/run
