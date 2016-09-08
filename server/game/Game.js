const Config  = require('../../config');
const Level   = require('./Level');
const Player  = require('./Player');

class Game
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Level
         *
         * @type {Level}
         */
        this.level = new Level();

        /**
         * Time elapsed since the last update of scores
         *
         * @type {number}
         */
        this.playersLastUpdate = Config.game.timeBetweenPlayersUpdate;

        /**
         * Players
         *
         * @type {Array.<Player>}
         */
        this.players = [];

        /**
         * IO socket instance
         *
         * @type {IO}
         */
        this.io = null;

        /**
         * Waiting actions
         *
         * @type {Array.<Object>}
         */
        this.waitingActions = [];

        // Start main loop, we don't need 60FPS for the logic 10FPS should be enough
        setInterval(this.update.bind(this), 100);

        // Start sending player's scores
        setInterval(this.sendPlayersScore.bind(this), Config.game.timeBetweenPlayersUpdate * 1000);
    }

    /**
     * Set io socket to use
     *
     * @param {IO} io An IO socket instance
     */
    setSocket (io)
    {
        // Save
        this.io = io;

        // Link events to methods
        this.io.on('connection', (socket) =>
        {
            /**
             * On a new connection
             */
            this.onPlayerConnected(socket);

            /**
             * On a disconnection
             */
            socket.on('disconnect', this.onPlayerDisconnected.bind(this, socket));

            /**
             * Call on a player action
             */
            socket.on('PlayerAction', this.onPlayerAction.bind(this, socket));

            /**
             * Action on a nickname update
             */
            socket.on('UpdateNickName', (data) =>
            {
                let success = this.onPlayerUpdateNickName(socket.id, data.name);
                if (success)
                    socket.emit('NicknameUpdated', null);
            });
        });

        // First update
        this.sendPlayersScore();
    }

    /**
     * Call when a player do an action (add or remove a ball)
     *
     * @param {Object} socket Socket data
     * @param {Object} data Unique identifier
     * @return {bool} True if the action has been executed, otherwise false
     */
    onPlayerAction (socket, data)
    {
        // Find the player
        let index = this.findPlayerIndex(socket.id);
        if (index <= -1)
            return false;

        // Block spam
        let now = new Date().getTime();
        if (now - this.players[index].lastAction < Config.game.timeBetweenActions * 1000)
        {
            socket.emit('action_ignored', this.players[index].lastAction);
            return false;
        }

        // Protect actions on grey balls
        if (data.type == Config.game.ballTypes.Grey)
            return false;

        // Process the action
        this.waitingActions.push({'action': data.action, 'data': data, 'player': this.players[index].id});
        this.players[index].lastAction = now;

        return true;
    }

    /**
     * Call when we have a new player
     *
     * @param {object} socket Socket
     */
    onPlayerConnected (socket)
    {
        // Save the player
        this.players.push(new Player(socket.id));

        // Send him the level's state
        socket.emit('level_load', {'level' : this.level});
    }

    /**
     * Call when a player log out
     *
     * @param {IO.Socket} socket Source
     */
    onPlayerDisconnected (socket)
    {
        let index = this.findPlayerIndex(socket.id);
        if (index > -1)
            this.players.splice(index, 1);
    }

    /**
     * Call when a player change his nick name
     *
     * @param {string} id Unique identifier
     * @param {string} name New nickname
     * @return {bool} True if the nickname has been updated
     */
    onPlayerUpdateNickName (id, name)
    {
        let index = this.findPlayerIndex(id);
        if (index <= -1) 
            return false;

        this.players[index].name = name;

        return true;
    }

    /**
     * Find player by ID
     *
     * @param {number} id Identifier
     * @return {number} Index of the player, otherwise -1
     */
    findPlayerIndex (id)
    {
        for (let i = 0; i < this.players.length; i++)
            if (this.players[i].id === id)
                return i;

        return -1;
    }

    /**
     * Send players scores
     */
    sendPlayersScore ()
    {
        if (!this.io)
            return;

        let players = this.players;
        players.sort((a, b) => 
        {
            if (a.score < b.score)
                return 1;

            if (a.score > b.score)
                return -1;

            return 0;
        });

        this.io.emit('players', players);
    }

    /**
     * Update logic
     */
    update ()
    {
        // Process waiting actions
        let updates = [];
        for (let i = 0; i < this.waitingActions.length; i++)
        {
            switch(this.waitingActions[i].action)
            {
                case Config.game.events.AddBall:
                    let ball = this.level.createBall(this.waitingActions[i].data.type, this.waitingActions[i].player);
                    updates.push({'action': this.waitingActions[i].action, 'ball': ball});
                    this.searchCombos (updates, null, this.waitingActions[i].player, true);
                    break;
                case Config.game.events.RemoveBall:
                    let index = this.level.removeBall(this.waitingActions[i].data.ball);
                    updates.push({'action': Config.game.events.RemoveBall, 'ball': this.waitingActions[i].data.ball});
                    this.searchCombos (updates, index, this.waitingActions[i].player, false);
                    break;
                default:
                    break;
            }
        }

        // Send updates to everyone
        if (this.waitingActions.length > 0 && updates.length > 0)
        {
            this.io.emit('level_update', updates);
            this.waitingActions.length = 0;
        }
    }

    /**
     * Search and create combo
     *
     * @param {array} updates Array of updates to fill with new events
     * @param {number} lastBallIndex Old index of the ball concerned by the current action
     * @param {string} player Id of player doing the action
     * @param {bool} startFromLastAction True to check combo from the last action
     * @private
     */
    searchCombos (updates, lastBallIndex, player, startFromLastAction = true)
    {
        if (this.level.balls.length <= 1)
            return;

        if (startFromLastAction)
        {
            let combo = 1;

            // 1 - Search combo
            let last = this.level.balls[this.level.balls.length - 1]; 
            for (let i = this.level.balls.length - 2; i >= 0; i--)
            {
                if (this.level.balls[i].type != last.type)
                    break;

                combo++;
            }

            // 2 - Save elements to change
            if (combo >= Config.game.minCombo)
                this.updateBallsAndPlayerScore (updates, this.level.balls.length - combo, this.level.balls.length, last.owner);
        }
        // The last action was probably for removing a ball, so we should look neighbors to avoid processing all the level
        else
        {
            // Ignore next steps if it was the first or last ball of the level
            if (lastBallIndex == 0 || lastBallIndex > this.level.balls.length - 1)
                return;

            // Ignore next steps if neighbors are not of the same color it's useless to continue
            if (this.level.balls[lastBallIndex - 1].type != this.level.balls[lastBallIndex].type)
                return;

            // 1 - Search borders
            let minIndex = 0;
            let maxIndex = minIndex;
            let type     = this.level.balls[lastBallIndex].type;

            // 1.1 - min border
            for (let i = lastBallIndex - 1; i > 0; i--)
            {
                if (this.level.balls[i].type != type)
                    break;

                minIndex = i;
            }

            // 1.2 - max border
            for (let i = lastBallIndex; i < this.level.balls.length; i++)
            {
                if (this.level.balls[i].type != type)
                    break;

                maxIndex = i;
            }

            // 2 - Here we go
            let combo = (maxIndex - minIndex) + 1;
            let owner = this.level.balls[minIndex].owner;
            if (combo >= Config.game.minCombo)
                this.updateBallsAndPlayerScore (updates, minIndex, minIndex + combo, player);
        }
    }

    /**
     * Fill array of actions with updated balls
     *
     * @param {Array.<Object>} updates 
     * @param {number} min Minimum index
     * @param {number} max Maximum index
     * @param {string} player Player identifier
     * @private
     */
    updateBallsAndPlayerScore (updates, min, max, player)
    {
        // Convert elements to events
        for (let i = min; i < max; i++)
        {
            let updatedBall = this.level.updateBall(this.level.balls[i].id, Config.game.ballTypes.Grey, player);
            if (updatedBall)
                updates.push({'action': Config.game.events.UpdateBall, 'ball': updatedBall});
        }

        // Add a point to the player
        let index = this.findPlayerIndex(player);
        if (index <= -1)
            return;

        this.players[index].score += 1;
    }
}

module.exports = Game;