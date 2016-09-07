class Player
{
    /**
     * Constructor
     *
     * @param {string} id Unique identifier
     * @param {string} name Name
     */
    constructor (id, name = null)
    {
        /**
         * Identifier
         *
         * @type {string}
         */
        this.id = id;

        /**
         * Name
         *
         * @type {string}
         */
        this.name = name ? name : ('Player N°' + Math.round(Math.random() * 1000));

        /**
         * Score
         *
         * @type {number}
         */
        this.score = 0;

        /**
         * Score
         *
         * @type {number}
         */
        this.lastAction = 0;
    }
}

module.exports = Player;