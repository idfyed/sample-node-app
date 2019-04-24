#
# Copyright 2019 (C) IDFyed Solutions AB
#
# @author jonas
#
#
FROM crusaider/baseimage-node:0.1.0
MAINTAINER Jonas jonas@idfyed.com

# Install app dependencies
COPY eapi-client /app/eapi-client/.
COPY package.json /app/.
RUN cd /app; npm install --production

# Copy application code
COPY src /app/src/.

# The app runs on port 3000 over SSL
EXPOSE  3000

# Register the app as a service with my_init
RUN mkdir /etc/service/sample-app && \
    echo "#!/bin/sh\ncd /app\nexec npm start" > /etc/service/sample-app/run && \
    chmod +x /etc/service/sample-app/run
