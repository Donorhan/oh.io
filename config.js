let config = {};

// Common
config.port                             = 3000;

// Socket
config.socket                           = {};
config.socket.port                      = 8080;

// Ball's identifiers
config.game                             = {};
config.game.minCombo                    = 4;   // Minimum combo
config.game.timeBetweenPlayersUpdate    = 1.0; // Send scores sometimes
config.game.timeBetweenActions          = 5.0; // Players must wait this given amount of seconds to do another action
config.game.ballTypes                   = { 'Blue': 1, 'Red': 2, 'Grey': 3 };
config.game.events                      = { 'RemoveBall': 1, 'AddBall': 2, 'UpdateBall': 3 };

module.exports = config;