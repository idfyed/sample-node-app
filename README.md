# Diglias Go node.js sample application

A node.js based web application implementing a integration with the
Diglias GO service to authenticate users using the Diglias Me digital
ID. Even though this example focuses on using the
Diglias Me digtial ID, implementations that use alternate ID:s such as
Bank ID or Telia will be very similar and the authentication example is relevant in
those cases as well.

## Disclaimer

This is by no means a fully fledged web application, it is only a
example on how to communicate with the Diglias Go service to
authenticate a user and retrieve user attributes. The application does
not implement authorization at all. In a real world scenario the
implementer would have to use the information retrieved from the Diglias
system to authorize the user in the application context.

## Compatibility

Since the application is pure javascript it should be possible to run on
any platform where node.js exists. It has been developed and tested on
Mac OS. If you need to regenerate the ssl certificates the script
supplied is depending on bash and openssl, in that case a un*x flavor of
some sort is probably the most natural choice.

## Dependencies

The application is depending on that node.js and npm is installed on the
hosting system. Node and NPM can be downloaded here:
[https://nodejs.org/en/]() If new SSL certificates are to be generated,
the bash script `src/bin/certs/make-certs.sh` needs `opensll` to be
installed and available on the path.

## Installation

Clone the repository in your preferred location. Change to the root
directory of the cloned repository and issue  the following commands:

### Build the sub package `Diglias EAPI Client`

```
$ cd eapi-client
$ npm install
$ npm pack
$ cd ..
```

### Install main packe node dependencies

```
$ npm install
```

This will download and install all the necessary dependencies in a
subdirectory named `node_modules`.

## TLS (SSL) Certificates

The distribution includes self signed certificates for the hostname
`localhost`. If the application is to be launched under a different
hostname the certificates can be regenerated.

1. Make `src/bin/certs` the current directory
1. Run the command `bash make-certs.sh [hostname]` where `hostname` is
   the new hostname to issue certificates for.

## Usage

### Starting the server

In the root of the repository issue the command `npm start`. This will
start node.js running a web server on port 3000 by default. The port
number and some other runtime attributes can be managed trough
environment variabels. Look at the code in `src/bin/www`.

### Running the application

Point your browser to `https://localhost:3000`. Since the
application uses self signed SSL certificates you will receive a
warning and will have to trust the certificate. The sample includes
3 main scenarios:

#### Authenticate

Demonstrates authentication of a user either by requesting a default
set of attribute or by selecting a sub set of attributes to request. 
Once the authentication has been successfully completed, it is possible
to add a value to the users Diglias using the backend RP Management API.

#### Web Flow Connect

This flow shows how to add a attribute to the users Diglias profile as
part of a normal authentication flow.

#### App Initiated

A sample of how to implement a App initiated flow where the users journey
starts by scanning a static QR code and ends up with a web page rendered
in a web view in the Diglias app.

## Running in Docker

If you prefer, you can build a docker image of the application and run
it in a docker host. In that case it will not be necessary to install
node.js and npm and you will not start the application in your local
host.

### Build the Image using docker

Issue the command `docker build -t diglias-sample-app .` in the root
directory of the repository. This will build a image in your docker host
named `diglias-sample-app`.

### Run the Image

The application can be started in the docker host using the command
`docker run -p 3000 --name=diglias diglias-sample-app`. This will start
a container named `diglias` and expose the application on port 3000 of
the docker host.

### Build and Run with Docker Compose

If you have `docker-compose` available you can build and run in one
command. Chnage to the root of the repository and issue
`docker-compose up`.

To access the application point your browser to `https://[IP OF DOCKER 
HOST]:3000`. You can find out the IP of the docker host using
`docker-machine ip`.

## Application structure

The application in it self if a fairly straight forward web application
based on the [Express](http://expressjs.com) web application framework.
The [Handlebars](http://handlebarsjs.com/) templating system is used to render
html.
From a Diglias integration point of view there are really three parts of the
source that is of interest:


* `src/routes/*` - This is where the application specific logics
  are implemented as a set of URL handlers that communicate with the
  Diglias service trough the users browser.
* `src/diglias-conf.json` - configuration data related to Diglias.
* `eapi-client/` - A separate **npm** package with a module that
 implements some of the API specific logic's, this package can be
 extracted and reused in real world integration implementations.


### Configuration file

The file `src/diglias-conf.json` contains configuration data related to
the integration with Diglias the Diglias Go service, there are three
main sections of informaton:

#### endPoint

The `endPoint` configures what environment to use, possible values are
`prod`,`prodTest` and `test`. The value is optional and if omitted the
application will default to use the `prodTest` environment.


```json
{
  "endPoint": "prodTest"
}
```

#### login

The `login` object defines what relying party configuration to use for
authentication of users. It contains two properties:

```json
{
  "login": {
    "auth_companyname": "playground",
    "mac_key": "LW4eUhQkJfwJGgQU8JCT/g=="
  }
}
```

### rpManagement

The rpManagement object defines how to communicate with the RP Management
API to set a attribute without the users involvement.

```json
{
    "rpManagement": {
      "companyname": "playground",
      "user": "playground",
      "secret": "mIl9bYOf/mSq5DGjgACyXw=="
    }
}
```

#### Example configuration file

```json
{
    "endPoint": "test",
    "login": {
        "auth_companyname": "playground",
        "mac_key": "PNKVwU4S+TLvMm2QwTVMkQ=="
    },
    "rpManagement": {
      "companyname": "playground",
      "user": "playground",
      "secret": "mIl9bYOf/mSq5DGjgACyXw=="
    }
}
```

## Contact and Feedback

Any questions, or feedback on the code or Diglias in general?

jonas@diglias.com

Copyright (c) 2017 Diglias AB

Author: Jonas
