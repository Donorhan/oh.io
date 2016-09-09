import * as Config from '../../config.js';

export class Socket
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * Unique instance
         * 
         * @type {Socket}
         */
        this.socket = io.connect(Config.host + ':' + Config.socket.port);
    }

    /**
     * Get singleton instance
     * 
     * @return {Socket}
     */
    static getInstance ()
    {
        if (Socket.instance === null)
            Socket.instance = new Socket();

        return Socket.instance;
    }

    /**
     * "Overwrite" the "on" method of socket.io
     * 
     * @param {string} name Name of the event
     * @param {function} callback Callback
     */
    on (name, callback)
    {
        this.socket.on(name, callback);
    }

    /**
     * Send an event
     * 
     * @param {string} name Name of the event
     * @param {Object} data Data
     */
    emit (name, data)
    {
        this.socket.emit(name, data);
    }
}

/**
 * Unique instance
 * 
 * @type {Socket}
 */
Socket.instance = null;