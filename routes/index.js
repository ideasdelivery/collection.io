'use strict';
const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const rp = require('request-promise');
const logger = require('../lib/logger');
router.get('/', function(req, res) {
    res.json({
        title: 'welcome to collection.io',
        usage: 'get request to /:query'
    });
});

router.get('/:query', function(req, res) {
    var query = req.params.query.replace(' ', '+');
    rp('http://prerender:3050/http://api.duckduckgo.com/?q=' + query + '&ia=web')
        .then(function(htmlString) {
            var $ = cheerio.load(htmlString);
            var resultElms = $('.result__body');
            var result = [];
            for (var i = 0; i < resultElms.length; i++) {

                logger.info(resultElms[i]);
                result.push(resultElms[i]);
            }

            res.json(result);
        }).catch(function(error) {
            logger.info('Error getHash', error);
            res.status(400).json(error);
        });

});

module.exports = router;
