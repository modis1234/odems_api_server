var express = require('express');
var router = express.Router();
var queryconfig = require('./query/site_query');

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
    @body siteName
    @body companyId
    @body siteUrl

*/
router.post('/', function (req, res, next) {
    var createdDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    console.log * (_body)
    _body.createdDate = createdDate;

    var _query = queryconfig.insert(_body);
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
//수정
/*
  @param id
  @body siteName
*/
router.put('/:id', function (req, res, next) {
    var modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    var _id = req.params.id;
    var _body = req.body;
    _body.id = _id;
    _body.modifiedDate = modifiedDate;
    console.log(_body);

    var _query = queryconfig.update(_body);
    console.log(_query);
    conn.query(_query, function (err, rows, fields) {
        if (err) {
            res.status(404).end();
        } else {
            res.json(rows);
        }
    });
});

//삭제
/*
  @param id
*/
router.delete('/:id', function (req, res, next) {
    var _id = req.params.id;
    console.log('id=>', _id);
    var _query = queryconfig.delete(_id);
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

//중복 체크
/*
  @body siteName
*/
router.post('/checked', function (req, res, next) {
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
