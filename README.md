# Idfyed Service node.js sample application

A node.js based web application implementing an integration with the
Idfyed service to authenticate users using the Idfyed Me digital
ID. Even though this example focuses on using the
Idfyed Digital ID, implementations that use alternate ID:s such as
Bank ID or Telia will be very similar and the authentication example is relevant in
those cases as well.

## Disclaimer

This is by no means a fully-fledged web application, it is only a
example on how to communicate with the Idfyed service to
authenticate a user and retrieve user attributes. The application does
not implement authorization at all. In a real world scenario the
implementer would have to use the information retrieved from the Idfyed
system to authorize the user in the application context.

## Compatibility

Since the application is pure javascript it should be possible to run on
any platform where node.js exists. It has been developed and tested on
Mac OSX. If you need to regenerate the server certificates used for SSL/TLS,
the script supplied is depending on bash and openssl, in that case a
un\*x flavor of some sort is probably the most natural choice.

## Dependencies

The application is depending on that node.js and npm is installed on the
hosting system. Node and NPM can be downloaded here:
[https://nodejs.org/en/]() If new server certificates are to be generated,
the bash script `src/bin/certs/make-certs.sh` needs `openssl` to be
installed and available in the path.

## Installation

Issue the following commands in the project directory:

### Build the sub package `Idfyed EAPI Client`

```
$ cd eapi-client
$ npm install
$ npm pack
$ cd ..
```

### Install main package node dependencies

```
$ npm install
```

This will download and install all the necessary dependencies in a
subdirectory named `node_modules`.

## Server Certificates

The distribution includes self signed certificates for the hostname
`localhost`. If the application is to be launched under a different
hostname the certificates can be regenerated.

1.  Make `src/bin/certs` the current directory
1.  Run the command `bash make-certs.sh [hostname]` where `hostname` is
    the new hostname to issue certificates for.

## Usage

### Starting the server

In the root of the project issue the command `npm start`. This will
start node.js running a web server on port 3000 by default. The port
number and some other runtime attributes can be managed through
environment variables. Look at the code in `src/bin/www`.

For security reasons the relying party configuration used in the code
will only accept requests originating from `http(s)://localhost*`.

### Running the application

Point your browser to `https://localhost:3000`. Since the
application uses self signed SSL certificates you will receive a
warning and will have to trust the certificate. The sample includes
3 main scenarios:

#### Authenticate

Demonstrates authentication of a user either by requesting a default
set of attribute or by selecting a subset.
Once the authentication has been successfully completed, it is possible
to add a value to the user's Idfyed using the backend RP Management API.

#### Web Flow Connect

This flow shows how to add an attribute to the user's Idfyed profile as
part of a normal authentication flow.

#### App Initiated

A sample of how to implement App initiated flow where the user's journey
starts by scanning a static QR code and ends up authenticated with a
web page rendered in the user's web browser or web view in the Idfyed
app.

## Running in Docker

If you prefer, you can build a docker image of the application and run
it in a docker host. In that case it will not be necessary to install
node.js and npm and you will not start the application in your local
host.

### Build the Image using docker

Issue the command `docker build -t idfyed-sample-app .` in the root
directory of the project. This will build an image in your docker host
named `idfyed-sample-app`.

### Run the Image

The application can be started in the docker host using the command
`docker run -p 3000 --name=idfyed idfyed-sample-app`. This will start
a container named `idfyed` and expose the application on port 3000 of
the docker host.

### Build and Run with Docker Compose

If you have `docker-compose` available you can build and run in one
command. Change to the root of the repository and issue
`docker-compose up`.

To access the application point your browser to `https://localhost:3000`.

## Application structure

The application in it self if a fairly straight forward web application
based on the [Express](http://expressjs.com) web application framework.
The [Handlebars](http://handlebarsjs.com/) templating system is used to render
html.
From a Idfyed integration point of view there are really three parts of the
source that is of interest:

- `src/routes/*` - This is where the application specific logics
  are implemented as a set of URL handlers that communicate with the
  Idfyed service through the user's browser.
- `src/idfyed-conf.json` - configuration related to Idfyed.
- `eapi-client/` - A separate **npm** package with a module that
  implements some of the API specific logic's, this package can be
  extracted and reused in real world integration implementations.

### Configuration file

The file `src/idfyed-conf.json` contains configuration data related to
the integration with the Idfyed service.

## Contact and Feedback

Any questions, or feedback on the code or Idfyed in general?

playground@idfyed.com

Copyright (c) 2019 Idfyed Solutions AB
