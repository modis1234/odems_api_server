var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/device_query');
const pool = require('./config/connection');

// var conn = mysql.createConnection(dbconfig);

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

//조회
router.get('/', function(req, res, next) {
    var _query = queryconfig.selectAll();
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

//id 조회
router.get('/:id', function(req, res, next) {
    var _id = req.params.id;

    var _query = queryconfig.selectOne(_id);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});
//입력
/*
    @body deviceName
*/
router.post('/', function(req, res, next) {
    var _body = req.body;
    var _query = queryconfig.insert(_body);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});
//수정
/*
  @param id
  @body id
  @body deviceName
*/
router.put('/:id',function(req, res, next) {
    var _id = req.params.id;
    var _body = req.body;
    _body.id = _id;
    var _query = queryconfig.update(_body);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

//삭제
/*
  @param id
*/
router.delete('/:id', function(req, res, next){
    var _id = req.params.id;

    var _query = queryconfig.delete(_id);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

//중복 체크
/*
  @body deviceName
*/
router.post('/checked', function(req, res, next){
    var _reqBody = req.body;
    console.log(_reqBody);
    var _query = queryconfig.checked(_reqBody);
    console.log(_query);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

module.exports = router;
