import * as Config from '../../config.js';

export class GameInterface
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Background texture
         *
         * @type {PIXI.TilingSprite}
         */
        this.background = null;

        /**
         * Red button
         *
         * @type {PIXI.Sprite}
         */
        this.red_button = null;

        /**
         * Blue button
         *
         * @type {PIXI.Sprite}
         */
        this.blue_button = null;

        /**
         * Blue button's texture
         *
         * @type {PIXI.Texture}
         */
        this.blue_button_texture = null;

        /**
         * Red button's texture
         *
         * @type {PIXI.Texture}
         */
        this.red_button_texture = null;

        /**
         * Grey button's texture
         *
         * @type {PIXI.Texture}
         */
        this.grey_button_texture = null;

        /**
         * Interface's container
         *
         * @type {PIXI.Container}
         */
        this.container = new PIXI.Container();

        /**
         * Buttons callback
         *
         * @type {function}
         */
        this.buttonsCallback = null;

        /**
         * Text to show time to wait before the next action
         *
         * @type {PIXI.Text}
         */
        this.textLastAction = null;
    }

    /**
     * Init the game
     *
     * @param {number} screenWidth Screen width
     * @param {number} screenHeight Screen height
     */
    init (screenWidth, screenHeight)
    {
        // Carbon background texture
        let backgroundTexture = PIXI.Texture.fromImage('./img/background.jpg');
        this.background = new PIXI.extras.TilingSprite(backgroundTexture, screenWidth, screenHeight);
        this.container.addChild(this.background);

        // Create the red button
        this.red_button_texture = PIXI.Texture.fromImage('./img/red_button.png');
        this.red_button = new PIXI.Sprite(this.red_button_texture);
        this.red_button.anchor.x = 0.5;
        this.red_button.anchor.y = 0.5;
        this.red_button.position.x = screenWidth / 2.0 - 50;
        this.red_button.position.y = screenHeight - 100;
        this.red_button.interactive = true;
        this.red_button.on('mousedown', this.onButtonDown.bind(this, this.red_button));
        this.red_button.on('mouseup', this.onButtonUp.bind(this, this.red_button));
        this.container.addChild(this.red_button);

        // Create the blue button
        this.blue_button_texture = PIXI.Texture.fromImage('./img/blue_button.png');
        this.blue_button = new PIXI.Sprite(this.blue_button_texture);
        this.blue_button.anchor.x = 0.5;
        this.blue_button.anchor.y = 0.5;
        this.blue_button.position.x = screenWidth / 2.0 + 50;
        this.blue_button.position.y = this.red_button.position.y;
        this.blue_button.interactive = true;
        this.blue_button.on('mousedown', this.onButtonDown.bind(this, this.blue_button));
        this.blue_button.on('mouseup', this.onButtonUp.bind(this, this.blue_button));
        this.container.addChild(this.blue_button);

        // Texture to use for busy buttons
        this.grey_button_texture = PIXI.Texture.fromImage('./img/grey_button.png');

        // Text showing time before the next authorized action
        this.textLastAction = new PIXI.Text('');
        this.textLastAction.x = screenWidth / 2.0;
        this.textLastAction.y = screenHeight - 35;
        this.textLastAction.anchor.x = 0.5;
        this.textLastAction.anchor.y = 0.5; 
        this.textLastAction.style = {fill:"white"};
        this.container.addChild(this.textLastAction);
    }

    /**
     * On button down
     *
     * @param {PIXI.Sprite} button Event's origin
     */
    onButtonDown (button)
    {
        button.texture = this.grey_button_texture;
    }

    /**
     * On button up
     *
     * @param {PIXI.Sprite} button Event's origin
     */
    onButtonUp (button)
    {
        button.texture = (button == this.red_button) ? this.red_button_texture : this.blue_button_texture;

        if (this.buttonsCallback)
            this.buttonsCallback((button == this.red_button) ? Config.game.ballTypes.Red : Config.game.ballTypes.Blue);
    }

    /**
     * Set button's callback
     *
     * @param {function} callback Callback when an action occured on buttons
     */
    setButtonsCallback (callback)
    {
        this.buttonsCallback = callback;
    }

    /**
     * Update text
     *
     * @param {string} text Text value
     */
    updateText (lastAction)
    {
        if (!this.textLastAction)
            return;

        let now = new Date().getTime();
        let timeLeft = Math.round((Config.game.timeBetweenActions + 0.1) - ((now - lastAction) / 1000));
        timeLeft = Math.max(Math.min(Config.game.timeBetweenActions, timeLeft), 0.0);
        this.textLastAction.visible = !(timeLeft <= 0);

        this.textLastAction.text = 'You must wait ' + timeLeft + ' second' + ((timeLeft > 1.0) ? 's' : '');
    }

    /**
     * Get container
     *
     * @return {PIXI.Container}
     */
    getContainer ()
    {
        return this.container;
    }
}
