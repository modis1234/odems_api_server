var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('./config/database');
var queryconfig = require('./query/network_query');
var ups_queryconfig = require('./query/ups_query');
var portscanner = require('./config/portscan');


var conn = mysql.createConnection(dbconfig);

function handleDisconnect() {
  conn.connect(function(err) {            
    if(err) {                            
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }                                   
  });                                 
                                         
  conn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      return handleDisconnect();                      
    } else {                                    
      throw err;                              
    }
  });
}

handleDisconnect();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

function startScanner() {
    portscanner.stop();  
    clearInterval(selectInterval);
    var _query = queryconfig.selectAll();
    conn.query(_query, function(err, rows, fields) {
      if(err) {
        console.log(err)
      }else {
        portscanner.networkList=[];
        portscanner.networkList = rows;

        for( index in rows){
          var result = rows[index].result;
          if(result === 'closed'){       
            var closedObj = {};
            closedObj.id = rows[index].id;
            closedObj.url = rows[index].url;
            closedObj.port = rows[index].port;
            closedObj.deviceId = rows[index].device_id;
            closedObj.location =rows[index].location;
            closedObj.siteId = rows[index].site_id;
            var date = moment(rows[index].error_time).format('YYYY-MM-DD HH:mm:ss.SSS');
            closedObj["recordTime"] = date;
            closedObj["errorTime"] = date;
            closedObj["count"]=6;
            closedObj["result"]=rows[index].result;
            portscanner.closedNetwork.push(closedObj);
          }
        }
        console.log(portscanner.networkList.length);
        //portscanner.scanStartFnc();
        portscanner.start();
      }
    });
}

/* 운영시 네트워크 주석 제거 */
startScanner();

function updateNetList(){
  var _query = queryconfig.selectAll();
  conn.query(_query, function(err, rows, fields) {
    if(err) {
      console.log(err)
    }else {
      portscanner.networkList = rows;
    }
  });
}

/* 운영시 네트워크 주석 제거 */
var selectInterval = setInterval(updateNetList,30000);

//조회
router.get('/', function(req, res, next) {
  var _this = this;
  var _query = queryconfig.selectAll();
  conn.query(_query, function(err, rows, fields) {
      if(err) {
         res.status(404).end();
      }else {
       portscanner.networkList = rows;

       for( i in rows){
          rows[i]['record_time'] = rows[i]['record_time'] ? moment(rows[i]['record_time']).format() : null;
          rows[i]['error_time'] = rows[i]['error_time'] ? moment(rows[i]['error_time']).format() : null;          
        }
       res.json(rows);
      }
    });
  });
  
  router.get('/site', function(req, res, next){
   // console.log(req);
    var _query = queryconfig.findGroupBynetwork();
    conn.query(_query, function(err, rows, fields) {
      if(err) {
        res.status(404).end();
      }else {
        res.json(rows);
      }
    });
  
  });

  // 사이트에 등록된 장비 리스트 조회
  router.get('/site/:siteId', function(req, res, next){
    var _siteId = req.params.siteId;
     var _query = queryconfig.findGroupBynetworkNsite(_siteId);
     conn.query(_query, function(err, rows, fields) {
       if(err) {
         res.status(404).end();
       }else {
         
           res.json(rows);
       }
     });
   
   });

   // 등록 된 네트워크의 장비 타입별 수
  /* 
    @commant ODEMS 전체통계-장비 등록 현황
  */
   router.get('/device/registed/count', function(req, res, next){
     var _query = queryconfig.findBydeviceCount();
     console.log(_query);
     conn.query(_query, function(err, rows, fields) {
       if(err) {
         res.status(404).end();
       }else {
         res.json(rows);
       }
     });
   
   });
   // 현장별 등록 된 네트워크의 장비 타입별 수
  /* 
    @params siteId 현장ID
    @commant ODEMS 현장별 통계-장비 등록 현황
  */
 router.get('/device/registed/count/:siteId', function(req, res, next){
   var param = req.params.siteId;
  var _query = queryconfig.findBydeviceCountNsiteId(param);
  console.log(_query);
  conn.query(_query, function(err, rows, fields) {
    if(err) {
      res.status(404).end();
    }else {
      res.json(rows);
    }
  });

});

// error watch
router.get('/error', function(req, res, next){

  console.log(">>>>",portscanner.closedNetwork);
  res.json(portscanner.closedNetwork);

});

//사이트 별 조회
router.get('/:siteId', function(req, res, next) {
  var _this = this;
  var _siteId = req.params.siteId;
  var _query = queryconfig.siteSelect(_siteId);
  conn.query(_query, function(err, rows, fields) {
      if(err) {
         res.status(404).end();
      }else {
        console.log(rows);
          for( i in rows){
            rows[i]['record_time'] = rows[i]['record_time'] ? moment(rows[i]['record_time']).format() : null;
            rows[i]['error_time'] = rows[i]['error_time'] ? moment(rows[i]['error_time']).format() : null;          
          }
        res.json(rows);
      }
  });
});

//디바이스 조회
/* 
  @param deviceId
  @commant ODMS UPS이력 조회-ups장비 조회
*/
router.get('/device/:deviceId', function(req, res, next) {
  var _this = this;
  var _deviceId = req.params.deviceId;
  var _query = queryconfig.findBydevice(_deviceId);
  conn.query(_query, function(err, rows, fields) {
      if(err) {
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
    @body siteId
    @body result
*/
router.post('/', function(req, res, next) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _reqBody = req.body;
    _reqBody.createDate = date;
    console.log(_reqBody);
    var _query = queryconfig.insert(_reqBody);
    console.log(_query);


    conn.query(_query, function(err, rows, fields) {
        if(err) {
           res.status(404).end();   
        }else {
          console.log(rows);   
          portscanner.networkList.push(rows);   
          res.json(rows);
        }
    });
});




// router.post('/', function(req, res, next) {
//   var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
//     var _reqBody = req.body;
//     _reqBody.createDate = date;
//     console.log(_reqBody);
//     var _query = queryconfig.insert(_reqBody);
//     console.log(_query);


//     conn.query(_query, function(err, rows, fields) {
//         if(err) {
//            res.status(404).end();   
//         }else {
//           console.log(rows);   
//           portscanner.networkList.push(rows);   
//           res.json(rows);
//         }
//     });
// });


//수정
/*
  @param id
  @body url
  @body port 
  @body neType
  @body location
  @body result
  @body description
*/
router.put('/:id',function(req, res, next) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var reqBody = req.body;
    var _id = req.params.id;

    reqBody.id = _id;
    reqBody.date = date;
    console.log(reqBody)
    var _deviceId = reqBody.deviceId;
    var _query;
    if(_deviceId == 3){
      _query = queryconfig.update(reqBody)
                  + ups_queryconfig.update(reqBody);
    } else {
       _query = queryconfig.update(reqBody);
    }
    console.log(_query);
    conn.query(_query, function(err, rows, fields) {
        if(err) {
           res.status(404).end();
        }else {
          //startScanner();
          res.json(rows);
        }
    });
});

//네트워크 삭제
router.delete('/:id', function(req, res, next){
  var _id = req.params.id;

  var _query = queryconfig.delete(_id);
  conn.query(_query, function(err, rows, fields) {
        if(err) {
          res.status(404).end();
      }else {
        console.log("rows->",rows);
        console.log("fields-->",fields);
        //startScanner();
        res.json(rows);
      }
  });
});



module.exports = router;
