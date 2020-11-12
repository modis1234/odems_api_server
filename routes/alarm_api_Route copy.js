var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('./config/database');
var queryconfig = require('./query/alarm_query');

var conn = mysql.createConnection(dbconfig);

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

//조회
router.get('/', function(req, res, next) {
    var _query = queryconfig.selectAll();
    conn.query(_query, function(err, rows, fields) {
        if(err){
            console.log(err);
            res.status(404).end();
        }else{
            res.json(rows);
        }
    });
});

//id 조회
/*
    @param id
*/
router.get('/:id', function(req, res, next) {
    var _id = req.params.id;

    var _query = queryconfig.selectOne(_id);
    conn.query(_query, function(err, rows, fields) {
        if(err){
            console.log(err);
            res.status(404).end();
        }else{
            res.json(rows);
        }
    });
});

router.get('/site/:siteId', function(req, res, next) {
    var _siteId = req.params.siteId;
    var _query = queryconfig.selectSite(_siteId);
    conn.query(_query, function(err, rows, fields) {
        if(err){
            console.log(err);
            res.status(404).end();
        }else{
            res.json(rows);
        }
    });
});




module.exports = router;
