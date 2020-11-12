var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/company_query');

// var conn = mysql.createConnection(dbconfig);
const pool = require('./config/connection');

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
                if(err){
                    console.log(err);
                    res.status(404).end();
                }else{
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
router.get('/:id', function(req, res, next) {
    var _id = req.params.id;

    var _query = queryconfig.selectOne(_id);

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if(err){
                    console.log(err);
                    res.status(404).end();
                }else{
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});
//입력
/*
    @body companyName

*/
router.post('/', function(req, res, next) {
    var createdDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    _body.createdDate = createdDate;

    var _query = queryconfig.insert(_body);
    console.log(_query);
    
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if(err){
                    res.status(404).end();
                }else {
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
  @body companyName
*/
router.put('/:id',function(req, res, next) {
    var modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _id = req.params.id;
    var _body = req.body;
    _body.id = _id;
    _body.modifiedDate = modifiedDate;
    var _query = queryconfig.update(_body);
    console.log(_query);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if(err){
                    res.status(404).end();
                }else {
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
    console.log(_query);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if(err){
                    res.status(404).end();
                }else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });

});

//중복 체크
/*
  @body companyName
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
                if(err){
                    res.status(404).end();
                }else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

module.exports = router;
