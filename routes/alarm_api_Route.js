var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
var queryconfig = require('./query/alarm_query');
const pool = require('./config/connection');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

//조회
router.get('/', function (req, res, next) {
    var _query = queryconfig.selectAll();
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(404).end();
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

//id 조회
/*
    @param id
*/
router.get('/:id', function (req, res, next) {
    var _id = req.params.id;

    var _query = queryconfig.selectOne(_id);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(404).end();
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

router.get('/site/:siteId', function (req, res, next) {
    var _siteId = req.params.siteId;
    var _query = queryconfig.selectSite(_siteId);

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(404).end();
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});


module.exports = router;
