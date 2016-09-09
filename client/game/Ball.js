import * as Config from '../../config.js';

export class Ball
{
    /**
     * Constructor
     *
     * @param {number} id Unique identifier
     * @param {number} color Color to assign
     * @param {function} clickCallback Function to call on a click
     */
    constructor (id, color, clickCallback = null)
    {
        /**
         * Unique identifier
         *
         * @type {number}
         */
        this.id = id;

        /**
         * Color
         *
         * @type {number}
         */
        this.color = Config.game.ballTypes.Grey;

        /**
         * Position
         *
         * @type {Object.<number>}
         */
        this.position = {x: 0, y: 0};

        /**
         * Targeted position
         *
         * @type {Object.<number>}
         */
        this.targetedPosition = {x: 0, y: 0};

        /**
         * Sprite
         *
         * @type {PIXI.Sprite}
         */
        this.sprite = null;

        // Auto init
        this.init(clickCallback);
        this.setColor(color);
    }

    /**
     * Init
     *
     * @param {function} clickCallback Function to call on a click
     */
    init (clickCallback)
    {
        if (Ball.textures.length == 0)
        {
            Ball.textures[Config.game.ballTypes.Grey] = PIXI.Texture.fromImage('./img/grey_ball.png');
            Ball.textures[Config.game.ballTypes.Blue] = PIXI.Texture.fromImage('./img/blue_ball.png');
            Ball.textures[Config.game.ballTypes.Red]  = PIXI.Texture.fromImage('./img/red_ball.png');
        }

        this.sprite = new PIXI.Sprite(Ball.textures[Config.game.ballTypes.Grey]);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        if (clickCallback)
            this.sprite.on('mousedown', clickCallback.bind(null, this));
    }

    /**
     * Update ball's color
     *
     * @param {number} color Color to assign
     */
    setColor (color)
    {
        this.color = color;
        this.sprite.interactive = (color !== Config.game.ballTypes.Grey);
        this.sprite.texture = Ball.textures[color];
    }

    /**
     * Set position
     *
     * @param {number} x Position on x
     * @param {number} y Position on y
     */
    setPosition (x, y)
    {
        this.position.x = x;
        this.position.y = y;
    }

    /**
     * Set targeted position
     *
     * @param {number} x Position on x
     * @param {number} y Position on y
     * @param {bool} teleport True to teleport without transition
     */
    setTargetedPosition (x, y, teleport = false)
    {
        this.targetedPosition.x = x;
        this.targetedPosition.y = y;

        if (teleport)
        {
            this.position.x = x;
            this.position.y = y;
        }
    }

    /**
     * Update
     */
    update ()
    {
        // Compute difference target <-> ball
        let diffX = this.targetedPosition.x - this.position.x;
        let diffY = this.targetedPosition.y - this.position.y;

        // Update his view
        this.position.x += diffX * Ball.speed;
        this.position.y += diffY * Ball.speed;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }
}

/**
 * PIXI container
 *
 * @type {PIXI.Container}
 */
Ball.container = null;

/**
 * Movement speed
 *
 * @type {number}
 */
Ball.speed = 0.05;

/**
 * Padding between balls
 *
 * @type {number}
 */
Ball.padding = 64;

/**
 * Unique texture
 *
 * @type {Array.<number, PIXI.Texture>}
 */
Ball.textures = [];
