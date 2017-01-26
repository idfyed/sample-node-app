# Diglias Go node.js sample application

A node.js based web application implementing a integration with the
Diglias GO service over the EAPI protocol to authenticate users using
the Diglias Me digital ID. Even thoug this example focuses on using the
Diglias Me digtial ID, implementations that use altarnate ID:s such as
Bank ID or Telia will be very similar and the example is relavant on
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
directory of the cloned repository and issue the command: `npm install`.
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

  1. Point your browser to `https://localhost:3000`. Since the
  application uses self signed SSL certificates you will receive a
  warning and will have to trust the certificate.
  1. Click the link **Authenticate**. Your browser should now get
  redirected to the Diglias server that will render a QR code on the
  screen.
  1. Use your Diglias Me id to authenticate yourself to the Diglias
  system.

	  1. If the Diglias Me in use is new (i.e. is missing a verified
    personal identification number) the first authentication will fail.
    You will be presented with a form where you are expected to submit a
    personal identification number. 
	  1. When the form has been submitted a new QR code will be rendered.
    Use your Diglias 	Me to scan the code.
	  1. Since you are adding a verified attribute to the Diglias ME you
    will be asked to 	enter create a PIN, verify it and enter it a third
    time.
	  1. Confirm that the personal idenfificatiion number is correct and
    add it to the 	Diglais ME.
	  1. The process will start over from step 3

  1. If the authentication is successful you will be directed back to
  the application where all the supplied user properties will be
  rendered on a page.

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
The [Jade](http://jade-lang.com) templating system is used to render
html.
From a Diglias integration point of view there are really three source
files that is of interest:


* `src/routes/index.js` - This is where the application specific logics
  are implemented as a set of URL handlers that communiate with the
  Diglias service trough the users browser.
* `src/diglias-conf.json` - configuration data related to Diglias.
* `eapi-client/` - A separate **npm** package with a module that
 implements some of the API specific logics, this package can be
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

The `login` object defines whar relying party configuration to use for
authentication of users. It contains two properties:

```json
{
  "login": {
    "auth_companyname": "playground",
    "mac_key": "LW4eUhQkJfwJGgQU8JCT/g=="
  }
}
```

### levelUp

The `levelUp` object defines what relying party configuration to use
when the user is missing a verified personal identification number and
is required to "level up". It contains the same set of properties as the
`login` object.

```json
{
  "levelUp": {
    "auth_companyname": "playgroundAmbassador",
    "mac_key": "5osdC7Gs6OfHdHO9ZB7DaQ=="
  }
}
```

#### Example configuration file

```json
{
  "endPoint": "prodTest",
  "login": {
    "auth_companyname": "playground",
    "mac_key": "LW4eUhQkJfwJGgQU8JCT/g=="
  },
  "levelUp": {
    "auth_companyname": "playgroundAmbassador",
    "mac_key": "5osdC7Gs6OfHdHO9ZB7DaQ=="
  }
}
```

## Contact and Feedback

Any questions, or feedback on the code or Diglias in general?

jonas@diglias.com

Copyright (c) 2016 Diglias AB

Author: Jonas
