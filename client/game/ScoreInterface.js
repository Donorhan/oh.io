export class ScoreInterface
{
    /**
     * Constructor
     */
    constructor ()
    {
        /**
         * DOM container
         *
         * @type {HTMLElement}
         */
         this.container = document.getElementById('scores');
    }

    /**
     * Update interface
     *
     * @param {Array.<Object>} players Collection of players
     */
    update (players)
    {
        if (!this.container) {
            this.container = document.getElementById('scores');            
            return;
        }

        // Clear scores
        this.container.firstChild.innerHTML = '';

        // For performance reasons we should show a small part on the array, like:
        // - The 5 best scores
        // - The 5 players around the current player
        // But for now we show all the players
        for (let i = 0; i < players.length; i++)
        {
            let tr = document.createElement('tr');

            let td_rank = document.createElement('td');
            td_rank.className = 'rank';
            td_rank.appendChild(document.createTextNode('#' + (i + 1)));
            tr.appendChild(td_rank); 

            let td_name = document.createElement('td');
            td_name.className = 'name';
            td_name.appendChild(document.createTextNode(players[i].name));
            tr.appendChild(td_name); 

            let td_score = document.createElement('td');
            td_score.className = 'score';
            td_score.appendChild(document.createTextNode(players[i].score));
            tr.appendChild(td_score); 

            this.container.firstChild.appendChild(tr);    
        }
    }
}
