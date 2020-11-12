var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/hds/manager_query');

const pool = require('./config/connection');

//조회
router.get('/', function (req, res, next) {
    var _query = queryconfig.selectAll();
    conn.query(_query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.json(rows);
        }
    });
});

//id 조회
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
    @body level 0 OR 1
    @body name
    @body tel
    @body upsId
*/
router.post('/', function (req, res, next) {
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
  @body level 0 OR 1
  @body name
  @body tel
  @body upsId
*/
router.put('/:id', function (req, res, next) {
    var _id = req.params.id;
    var _body = req.body;
    console.log(_body);
    _body.id = _id;
    var _query = queryconfig.update(_body);
    console.log(_query)
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
router.delete('/:id', function (req, res, next) {
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


module.exports = router;
