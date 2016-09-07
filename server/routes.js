module.exports = function (app)
{
    // Dependencies
    const express         = require("express");
    const router          = express.Router();
    const siteController  = require('./site/SiteController');

    // Non-module pages
    router.get('/', siteController.home);

    app.use('/', router);
};
