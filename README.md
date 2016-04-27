# Diglias Go node.js sample application
A node.js based web application implementing a integration with the Diglias GO service over the EAPI protocol to authenticate users using the Diglias Me digital ID.

## Disclaimer
This is by no means a fully fledged web application, it is only a example on how to communicate with the Diglias Go service to authenticate a user and retrieve user attributes. The application does not implement authorization at all. In a real world scenario the implementer would have to use the information retrieved from the Diglias system to authorize the user in the current context.

## Compatibility
Since the application is pure javascript it should be possible to run on any platform where node.js exists. It has been developed and tested on Mac OS X. If you need to regenerate the ssl certificates the script supplied is depending on bash and openssl, in that case a un*x flavor of some sort is probably the most natural choice.

## Dependencies
The application is depending on that node.js and npm is installed on the hosting system. Node and NPM can be downloaded here: https://nodejs.org/en/
If new SSL certificates are to be generated, the bash script `bin/certs/make-certs.sh` needs `opensll` to be installed and available on the path.  

## Installation
Clone the repository in your preferred location. Change to the root directory of the cloned repository and issue the command: `npm install`. 
This will download and install all the necessary dependencies in a subdirectory named `node_modules`.

## TLS (SSL) Certificates
The distribution includes self signed certificates for the hostname `localhost`. If the application is to be launched under a different hostname the certificates can be regenerated.
1. Make `bin/certs` the current directory
2. Run the command `bash make-certs.sh [hostname]` where `hostname` is the new hostname to issue certificates for.

## Usage

### Starting the server
In the root of the repository issue the command `npm start`. This will start node.js running a web server on port 3000 by default.
The port number and some other runtime attributes can be managed trough environment variabels. Look at the code in `bin/www`.

### Running the application
1. Point your browser to `https://localhost:3000`. Since the application uses self signed SSL certificates you will receive a warning and will have to trust the certificate.
2. Click the link **Authenticate**. Your browser should now get redirected to the Diglias server that will render a QR code on the screen.
3. Use your Diglias Me id to authenticate yourself to the Diglias system.
4. If the authentication is successful you will be directed back to the application where all the supplied user properties will be rendered on a page.

## Running in Docker
If you prefer, you can build a docker image of the application and run it in a docker host. In that case it will not be necessary to install node.js and npm and you will not start the application in you local host.
### Build the Image using docker
Issue the command `docker build -t diglias-sample-app .` in the root directory of the repository. This will build a image in your docker host named `diglias-sample-app`.
### Run the Image
The application can be started in the docker host using the command `docker run -p 3000 --name=diglias diglias-sample-app`. This will start a container named `diglias` and expose the application on port 3000 of the docker host.
### Build and Run with Docker compose
If you have `docker-compose` available you can build and run in one command. Chnage to the root of the repository and issue `docker-compose up`.

To access the application point your browser to `https://[IP OF DOCKER HOST]:3000`. You can find out the IP of the docker host using `docker-machine ip`.
## Application structure
The application in it self if a fairly straight forward web application based on the [Express](http://expressjs.com) web application framework. The [Jade](http://jade-lang.com) templating system to render html.
From a Diglias integration point of view there are really three source files that is of interest:

*  `routes/index.js` - This is where the application specific logics are implemented as a set of URL handlers that communiate with the Diglias server trough the users browser.
*  `diglias-conf.json` - configuration data related to Diglais.
*  `./eapi-client` - A separate npm package with a module that implements some of the API specific logics, this package can be extracted and reused in real world integration implementations.

## Contact and feedback
Any questions, or feedback on the code or Diglias in general?

jonas@diglias.com

Copyright (c) 2016 Diglias AB

Author: Jonas