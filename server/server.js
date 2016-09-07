// Instances
const express    = require('express');
const config     = require('../config');
const app        = express();
const nunjucks   = require('nunjucks');
const bodyParser = require('body-parser');
const server     = require('http').Server(app);
const io         = require('socket.io')(server);
const fs         = require('fs');
const path       = require('path');
const Game       = require('./game/Game');

// Get all directories in a directory
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

// Configure template engine
nunjucks.configure(getDirectories('./'), { 
    autoescape: true ,
    express   : app
});

// Set "public" directory as an asset folder
app.use(express.static('../public'));

// Load routes
require('./routes')(app);

// Game instance
let game = new Game();
game.setSocket(io);

// Run
app.listen(config.port);

// Socket
server.listen(config.socket.port);
