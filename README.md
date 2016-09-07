Make combos to be the best.

![alt tag](http://i.imgur.com/CzWGIij.png)

CONTENTS OF THIS FILE
---------------------

 * Configuration
 * Installation
 * Architecture

CONFIGURATION
------------

A configuration file (config.js) is available from the root folder, feel free to change values.

INSTALLATION
------------
 
 * Clone (or download) the project repository then go to the project folder and install dependencies using the following command from the root folder:

        npm install

 * Then, you must generate the client files (from the root folder again)
 
        webpack

 * Everything should be ok now, the only things to do is to run the application from **the 'server' folder** and go to the application URL (by default: http://localhost:3000/)

        cd ./server
        node ./server.js

ARCHITECTURE
---
### Server
The server side is made with [Express.js](http://expressjs.com/fr/), [Socket.io](https://github.com/socketio/socket.io) and [Nunjucks](https://mozilla.github.io/nunjucks/]. 

### Client
The client use [Socket.io](https://github.com/socketio/socket.io) and [Pixi.js](https://github.com/pixijs/pixi.js)
