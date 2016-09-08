class SiteController
{
    /**
     * Show homepage
     *
     * @param {HTTPRequest} req A request object
     * @param {HTTPResponse} res A response object
     * @return {string} A HTML formatted view
     */
    home (req, res)
    {
        res.render('home.html');
    }
}

module.exports = new SiteController();