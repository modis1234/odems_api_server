var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('./config/database');
var queryconfig = require('./query/device_query');

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
//입력
/*
    @body deviceName
*/
router.post('/', function(req, res, next) {
    var _body = req.body;
    var _query = queryconfig.insert(_body);
    conn.query(_query, function(err, rows,fields) {
        if(err){
            res.status(404).end();
        }else {
            res.json(rows);
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
    conn.query(_query, function(err, rows,fields) {
        if(err){
            res.status(404).end();
        }else {
            res.json(rows);
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
    conn.query(_query, function(err, rows, fields){
        if(err){
            res.status(404).end();
        }else {
            res.json(rows);
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
    conn.query(_query, function(err, rows, fields) {
        if(err){
            console.log(err);
            res.status(404).end();
        }else{
            console.log(rows);
            res.json(rows);
        }
    });
});

module.exports = router;
