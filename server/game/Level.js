const Ball = require('./Ball');

class Level
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Collection of balls
         *
         * @type {Array.<Ball>}
         */
        this.balls = [];
    }

    /**
     * Create a new ball
     *
     * @param {number} type Type
     * @param {number} owner Owner
     * @return {Ball}
     */
    createBall (type, owner)
    {
        this.balls.push(new Ball(owner, type));
        return this.balls[this.balls.length - 1];
    }

    /**
     * Remove a ball from the level
     *
     * @param {number} id Identifier
     * @return {number} His index before suppresion
     */
    removeBall (id)
    {
        let index = this.findBallIndex(id);
        if (index === -1)
            return index;

        this.balls.splice(index, 1);

        return index;
    }

    /**
     * Update a ball
     *
     * @param {number} id Identifier
     * @param {number} type Type
     * @param {number} owner Owner
     * @return {Ball|null} The ball updated
     */
    updateBall (id, type, owner)
    {
        let index = this.findBallIndex(id);
        if (index === -1)
            return null;

        this.balls[index].type = type;
        this.balls[index].owner = owner;

        return this.balls[index];
    }

    /**
     * Find ball by ID
     *
     * @param {number} id Identifier
     * @return {number} Index of the ball, otherwise -1
     */
    findBallIndex (id)
    {
        for (let i = 0; i < this.balls.length; i++)
            if (this.balls[i].id === id)
                return i;

        return -1;
    }
}

module.exports = Level;