export class Camera
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Position
         *
         * @type {Object.<number>}
         */
        this.position = {x: 0, y: 0};

        /**
         * Speed
         *
         * @type {number}
         */
        this.speed = 0.1;

        /**
         * Targeted position
         *
         * @type {Object.<number>}
         */
        this.targetedPosition = {x: 0, y: 0};

        /**
         * Zoom
         *
         * @type {number}
         */
        this.zoom = 1;

        /**
         * Targeted zoom
         *
         * @type {Object.<number>}
         */
        this.targetedZoom = 1;
    }

    /**
     * Update
     */
    update ()
    {
        // Compute difference target <-> camera
        let diffX = this.targetedPosition.x - this.position.x;
        let diffY = this.targetedPosition.y - this.position.y;
        this.position.x += diffX * this.speed;
        this.position.y += diffY * this.speed;

        // Zoom transition
        let diffZ = this.targetedZoom - this.zoom;
        this.zoom += diffZ * this.speed;
    }

    /**
     * Set position
     *
     * @param {number} x Position on x
     * @param {number} y Position on y
     */
    setPosition (x, y)
    {
        this.targetedPosition.x = x;
        this.targetedPosition.y = y;
    }

    /**
     * Set zoom
     *
     * @param {number} value Value to add to the existing one
     */
    applyZoom (value)
    {
        this.targetedZoom += value;
        this.targetedZoom = Math.min(2, Math.max(this.targetedZoom, 0.8));
    }

    /**
     * Get position
     *
     * @return {Object.<number>}
     */
    getPosition ()
    {
        return this.position;
    }

    /**
     * Get zoom value
     *
     * @return {number}
     */
    getZoom ()
    {
        return this.zoom;
    }
}
