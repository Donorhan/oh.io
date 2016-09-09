import * as Config from '../../config.js';
import * as PIXI from 'pixi.js';

export class Renderer
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Pixi renderer
         *
         * @type {PIXI.Renderer}
         */
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor : 0x999999 });

        /**
         * Size
         *
         * @type {PIXI.Container}
         */
        this.size = {x : window.innerWidth, y: window.innerHeight};

        /**
         * Scene graph's root
         *
         * @type {PIXI.Container}
         */
        this.stage = new PIXI.Container();

        /**
         * Containers
         *
         * @type {Array.<string, PIXI.Container>}
         */
        this.containers = [];

        // Default containers
        this.containers['gui']  = new PIXI.Container();
        this.stage.addChild(this.containers['gui']);
        this.containers['game'] = new PIXI.Container();
        this.stage.addChild(this.containers['game']);
    }

    /**
     * Init
     */
    init ()
    {
        // Create view in the DOM
        document.getElementById('game').appendChild(this.renderer.view);

        // Allow auto resize
        this.renderer.autoResize = true;

        // Start rendering loop
        this.render();
    }

    /**
     * Add an element to the scene
     *
     * @param {PIXI.Sprite} child A PIXI child
     * @param {string} containerName Name of the container to use
     */
    addChild (child, containerName = 'game')
    {
        this.containers[containerName].addChild(child);
    }

    /**
     * Render
     */
    render ()
    {
        this.renderer.render(this.stage);
    }

    /**
     * Remove an element from the scene
     *
     * @param {PIXI.Sprite} child A PIXI child
     * @param {string} containerName Name of the container to use
     */
    removeChild (child, containerName = 'game')
    {   
        this.containers[containerName].removeChild(child);
    }

    /**
     * Apply a camera on a container
     *
     * @param {Camera} camera A camera intance
     * @param {string} containerName Name of the container to use
     */
    applyCamera (camera, containerName = 'game')
    {   
        let position = camera.getPosition();
        this.containers[containerName].x = position.x;
        this.containers[containerName].y = position.y;

        let zoom = camera.getZoom();
        this.containers[containerName].scale.x = zoom;
        this.containers[containerName].scale.y = zoom;
    }

    /**
     * Get size
     *
     * @return {Object.<number>}
     */
    getSize ()
    {   
        return this.size;
    }
}
