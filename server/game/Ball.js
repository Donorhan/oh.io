class Ball
{
    /**
     * Constructor
     *
     * @param {number} owner Owner's identifier
     * @param {number} type A number representing type
     */
    constructor (owner, type)
    {
        /**
         * Identifier
         *
         * @type {number}
         */
        this.id = ++Ball.UID;

        /**
         * Owner's identifier
         *
         * @type {number}
         */
        this.owner = owner;

        /**
         * Type
         *
         * @type {Config.game.ballTypes}
         */
        this.type = type;
    }
}

/**
 * Unique identifier
 *
 * @type {number}
 */
Ball.UID = 0;

module.exports = Ball;