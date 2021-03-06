var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('./config/database');
var queryconfig = require('./query/error_query');

var conn = mysql.createConnection(dbconfig);

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");



//조회
router.get('/errors', function(req, res, next) {
  var _this = this;
  var _query = queryconfig.selectAll();
  conn.query(_query, function(err, rows, fields) {
      if(err) {
        console.log(date);
         res.status(404).end();
      }else {
        res.json(rows);
      }
  });
});

//입력
/*
    @body url
    @body port 
    @body neType
    @body location
    @body companyId
    @body result
*/
router.post('/errors', function(req, res, next) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _req = req.body;
    _req.recorddTime = date;
    var _query = queryconfig.insert(_req);
    
    conn.query(_query, function(err, rows, fields) {
        if(err) {
           res.status(404).end();
        }else {
          console.log("rows->",rows);
          console.log("fields-->",fields);
          res.json(rows);
        }
    });
});


//수정
/*
  @param id
  @body url
  @body port 
  @body neType
  @body location
  @body companyId
  @body result
*/
router.put('/errors/:id',function(req, res, next) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _req = req.body;
    var _id = req.params.id;

    _req.id = _id;
    _req.date = date;

    var _query = queryconfig.update(_req);
    console.log(_query);
    conn.query(_query, function(err, rows, fields) {
        if(err) {
           res.status(404).end();
        }else {
          console.log("rows->",rows);
          console.log("fields-->",fields);
          res.json(rows);
        }
    });
});

router.delete('/errors/:id', function(req, res, next){
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

// 전체 현장 장애 발생 설치위치 조회
router.get('/location', function(req, res, next) {
  var _this = this;
  var _siteId = req.params.siteId;
  var _query = queryconfig.findBylocationAll();
  console.log(_query);
  conn.query(_query, function(err, rows, fields) {
      if(err) {
         res.status(404).end();
      }else {
        res.json(rows);
      }
  });
});

// 현장별 장애 발생 설치위치 조회
/*
  @param siteId
*/
router.get('/location/:siteId', function(req, res, next) {
  var _this = this;
  var _siteId = req.params.siteId;
  var _query = queryconfig.findBylocation(_siteId);
  console.log(_query);
  conn.query(_query, function(err, rows, fields) {
      if(err) {
         res.status(404).end();
      }else {
        res.json(rows);
      }
  });
});


// 현장 별 조회
router.get('/site/:siteId', function(req, res, next){
    var _siteId = req.params.siteId;

    var _query = queryconfig.findBysite(_siteId);
    console.log(_query);
    conn.query(_query, function(err, rows, fields){
      if(err){
          res.status(404).end();
      }else {
          res.json(rows);
      }
    });
});



// 검색 
/* 
  @body startDate
  @body endDate
  @body siteId
  @body deviceId(필수x)
  @commant 대곡-소사 네트워크 장애이력 검색
*/
router.post('/search', function(req, res, next) {
    var _reqBody = req.body;
    var _deviceId = _reqBody.deviceId || null;
    console.log(_deviceId)
    var _query;
    if(_deviceId){
      _query = queryconfig.findBytermNdeviceNsiteId(_reqBody);
    } else {
      _query = queryconfig.findBytermNsiteId(_reqBody);
    }
    console.log(_query);
    conn.query(_query, function(err, rows, fields){
        if(err){
            res.status(404).end();
        } else {
          for( i in rows){
            rows[i]['record_time'] = rows[i]['record_time'] ? moment(rows[i]['record_time']).format() : null;
            rows[i]['error_time'] = rows[i]['error_time'] ? moment(rows[i]['error_time']).format() : null;
            rows[i]['restore_time'] = rows[i]['restore_time'] ? moment(rows[i]['restore_time']).format() : null;
            
          }
          console.log(rows);
            res.json(rows);
            
        }
    });
});

// 검색 
/* 
  @body startDate
  @body endDate
  @body companyId
  @body siteId
  @body deviceId
  @commant ODMS 네트워크 장애이력 검색
*/
router.post('/network/search',function(req, res, next) {
    var reqBody = req.body;
    var companyId = reqBody.companyId;
    var siteId = reqBody.siteId;
    var deviceId = reqBody.deviceId;
    console.log('reqBody--->', reqBody);
    
    var query;
    // 기간&건설사( companyId=true, siteId=false, devcieId=false )
    if( companyId != undefined & !siteId & !deviceId ){
      console.log("기간&건설사");
      query = queryconfig.findByTermNCompany(reqBody);
    }
    // 기간&현장( companyId=false, siteId=true, devcieId=false )
    else if( !companyId & siteId != undefined & !deviceId ){
      console.log("기간&현장");
      query = queryconfig.findBytermNsiteId(reqBody);
      console.log(query);
    }
    // 기간&장비( companyId=false, siteId=false, devcieId=true )
    else if( !companyId & !siteId & deviceId != undefined ){
      console.log("기간&장비");
      query = queryconfig.findByTermNdevcie(reqBody);
    }
    // 기간&건설사&현장( companyId=true, siteId=true, devcieId=false )
    else if( companyId != undefined & siteId != undefined & !deviceId ){
      console.log("기간&건설사&현장");
      query = queryconfig.findByTermNcompanyNsite(reqBody);
    }
    // 기간&건설사&장비( companyId=true, siteId=false, devcieId=true )
    else if( companyId != undefined & !siteId & deviceId != undefined ){
      console.log("기간&건설사&장비");
      query = queryconfig.findByTermNcompanyNdevcie(reqBody);
    }
    // 기간&현장&장비( companyId=false, siteId=true, devcieId=true )
    else if( !companyId & siteId != undefined & deviceId != undefined ){
      console.log("기간&현장&장비");
      query = queryconfig.findBytermNdeviceNsiteId(reqBody);
    }
    // 기간&건설사&현장&장비 ( companyId=true, siteId=true, devcieId=true )
    else if( companyId != undefined & siteId != undefined & deviceId != undefined ){
      console.log("기간&건설사&현장&장비");
      query = queryconfig.findByTermNcompanyNsiteNdevcie(reqBody);

    }
    // 기간( companyId=false, siteId=false, devcieId=false )
    else if( !companyId & !siteId & !deviceId ){
      console.log("기간");
      query = queryconfig.findByTerm(reqBody);
    }
    conn.query(query, function(err, rows, fields){
      if(err){
          res.status(404).end();
      } else {
        var rowsLeng = rows.length;
        if(rowsLeng){
          for( i in rows){
            rows[i]['record_time'] = rows[i]['record_time'] ? moment(rows[i]['record_time']).format() : null;
            rows[i]['error_time'] = rows[i]['error_time'] ? moment(rows[i]['error_time']).format() : null;
            rows[i]['restore_time'] = rows[i]['restore_time'] ? moment(rows[i]['restore_time']).format() : null;
            
          }
           //console.log(rows);
           res.json(rows);
        } else {
           console.log(rows);
           res.json(rows);
        }
      }
  });    

});


// 사이트별 장애 발생 횟수 조회 
/* 
  @body startDate
  @body endDate
  @commant ODEMS 전체통계-사이트별 장애 발생 횟수 조회
*/
router.post('/site/count',function(req, res, next) {
  var reqBody = req.body;
  var query = queryconfig.groupBysiteNdevcie(reqBody);
  console.log(query)
  conn.query(query, function(err, rows, fields){
      if(err){
          res.status(404).end();
      } else {
          res.json(rows);
      }
  });    

});

// 사이트별 장애 발생 횟수 조회 
/* 
  @body startDate
  @body endDate
  @body siteId
  @commant ODEMS 현장별 통계-현장별 장비 장애 발생 횟수 조회
*/
router.post('/site/device/count',function(req, res, next) {
  var reqBody = req.body;
  var query = queryconfig.groupBysiteNdevcieFindBysiteId(reqBody);
  conn.query(query, function(err, rows, fields){
      if(err){
          res.status(404).end();
      } else {
          res.json(rows);
      }
  });    

});


module.exports = router;
