import {Ball} from './Ball.js';
import {Camera} from './Camera.js';
import {Renderer} from './Renderer.js';
import {Socket} from './Socket.js';
import {GameInterface} from './GameInterface.js';
import {ScoreInterface} from './ScoreInterface.js';
import * as Config from '../../config.js';

class Game
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Balls
         *
         * @type {Array.<Object>}
         */
        this.ballOrigin = {x: 0, y: 0};

        /**
         * Balls
         *
         * @type {Array.<Object>}
         */
        this.balls = [];

        /**
         * Camera
         *
         * @type {Camera}
         */
        this.camera = new Camera();

        /**
         * The renderer
         *
         * @type {Renderer}
         */
        this.renderer = new Renderer();

        /**
         * Main interface
         *
         * @type {GameInterface}
         */
        this.gameInterface = new GameInterface();

        /**
         * Interface with scores
         *
         * @type {ScoreInterface}
         */
        this.scoreInterface = new ScoreInterface();

        /**
         * Player's last action timer
         *
         * @type {number}
         */
        this.playerLastAction = 0;
    }

    /**
     * Init
     */
    init ()
    {
        // Init renderer
        this.renderer.init();
        this.gameInterface.init(this.renderer.getSize().x, this.renderer.getSize().y);
        this.gameInterface.setButtonsCallback(this.askBall.bind(this));

        // Load interface
        this.renderer.addChild(this.gameInterface.getContainer(), 'gui');

        // Prepare origin
        this.ballOrigin = {x: 0, y: this.renderer.getSize().y / 2.0};

        // Start listening the server
        Socket.getInstance().on('level_load', this.loadLevel.bind(this));
        Socket.getInstance().on('level_update', this.onLevelUpdated.bind(this));
        Socket.getInstance().on('action_ignored', this.onActionIgnored.bind(this));
        Socket.getInstance().on('players', this.scoreInterface.update);
    }

    /**
     * Add a new ball to the game
     *
     * @type {Object} data Ball's data
     * @type {bool} animate True to animate the spawn
     */
    addBall (data, animate = true)
    {
        let ball = new Ball(data.id, data.type, this.onBallClicked.bind(this));
        ball.setPosition(this.ballOrigin.x + ((this.balls.length + 1) * Ball.padding) + (animate ? 300 : 0), this.ballOrigin.y, !animate);
        this.balls.push(ball);
        this.renderer.addChild(ball.sprite);
    }

    /**
     * Ask to add a ball to the game
     *
     * @param {config.game.ballTypes} type Type of the ball to add
     */
    askBall (type)
    {
        this.playerLastAction = new Date().getTime();
        Socket.getInstance().emit('PlayerAction', {'action' : Config.game.events.AddBall, 'type': type});
    }

    /**
     * Find ball's index using his id
     *
     * @type {number} id Ball's identifier
     * @return {number} A positive interger, otherwise -1
     */
    findBall (id)
    {        
        for (let i = 0; i < this.balls.length; i++)
            if (this.balls[i].id === id)
                return i;

        return -1;
    }

    /**
     * On level loaded
     *
     * @param {object} data Level's data
     */
    loadLevel (data)
    {
        this.balls = [];

        for (let i = 0; i < data.level.balls.length; i++)       
            this.addBall(data.level.balls[i], false);
    }

    /**
     * Call when server an action from the player
     *
     * @param {object} data Data
     */
    onActionIgnored (data)
    {
        this.playerLastAction = data;        
    }

    /**
     * Call when the user click on a ball
     *
     * @param {Ball} A ball instance
     */
    onBallClicked (ball)
    {
        this.playerLastAction = new Date().getTime();
        Socket.getInstance().emit('PlayerAction', {'action' : Config.game.events.RemoveBall, 'ball': ball.id});
    }

    /**
     * Call when the level his updated
     *
     */
    onLevelUpdated (data)
    {
        for (let i = 0; i < data.length; i++)
        {
            switch(data[i].action)
            {
                case Config.game.events.RemoveBall:
                    this.removeBall(data[i].ball);
                    break;
                case Config.game.events.AddBall:
                    this.addBall(data[i].ball);
                    break;
                case Config.game.events.UpdateBall:
                    this.updateBall(data[i].ball);
                    break;
            }
        }
    }

    /**
     * Call on a mouse wheel event
     *
     * @type {object} event Mouse wheel's event
     */
    onMouseWheel (event)
    {
        let direction = (event.detail < 0 || event.wheelDelta > 0) ? -1 : 1;
        this.camera.applyZoom(direction / 10.0);
    }

    /**
     * Remove a ball
     *
     * @type {number} id Ball's identifier
     */
    removeBall (id)
    {
        let index = this.findBall(id);
        if (index === -1)
            return;

        let ball = this.balls[index];
        this.renderer.removeChild(ball.sprite);
        this.balls.splice(index, 1);
    }

    /**
     * Update a ball
     *
     * @type {object} newData New values
     */
    updateBall (newData)
    {
        let index = this.findBall(newData.id);
        if (index === -1)
            return;

        this.balls[index].setColor (newData.type);
    }

    /**
     * Update game's logic
     */
    update ()
    {
        requestAnimationFrame(this.update.bind(this));

        // Logic update
        for (let i = 0; i < this.balls.length; i++)
        {
            this.balls[i].setTargetedPosition(this.ballOrigin.x + ((i + 1) * Ball.padding), this.ballOrigin.y);
            this.balls[i].update();
        }

        // Update camera
        let lastBallPosition = this.balls.length * Ball.padding;
        this.camera.setPosition(this.renderer.getSize().x / 2.0 - lastBallPosition, 0);
        this.camera.update();
        this.renderer.applyCamera(this.camera);

        // Draw
        this.gameInterface.updateText (this.playerLastAction);
        this.renderer.render();
    }
}

/**
 * Encapsulate the game instance
 */
document.addEventListener('DOMContentLoaded', (event) => 
{
    // Init game instance
    let game = new Game();
    game.init();
    game.update();

    /**
     * Mouse wheel
     */
    document.addEventListener('DOMMouseScroll', game.onMouseWheel.bind(game), false); // Firefox
    document.addEventListener('mousewheel', game.onMouseWheel.bind(game), false); // Everyone else
});
