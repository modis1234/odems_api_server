var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/network_query');
var ups_queryconfig = require('./query/ups_query');
var portscanner = require('./config/portscan');
const pool = require('./config/connection');


// var conn = mysql.createConnection(dbconfig);

function handleDisconnect() {
  conn.connect(function (err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  conn.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      return handleDisconnect();
    } else {
      throw err;
    }
  });
}

// handleDisconnect();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

function startScanner() {
  portscanner.stop();
  clearInterval(selectInterval);
  var _query = queryconfig.selectAll();

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      throw err;
    } else {
      connection.query(_query, (err, results) => {
        if (err) {
          console.log(err)
          throw err;
        } else {
          portscanner.networkList = [];
          portscanner.networkList = results;

          for (index in results) {
            var result = results[index].result;
            if (result === 'closed') {
              var closedObj = {};
              closedObj.id = results[index].id;
              closedObj.url = results[index].url;
              closedObj.port = results[index].port;
              closedObj.deviceId = results[index].device_id;
              closedObj.location = results[index].location;
              closedObj.siteId = results[index].site_id;
              var date = moment(results[index].error_time).format('YYYY-MM-DD HH:mm:ss.SSS');
              closedObj["recordTime"] = date;
              closedObj["errorTime"] = date;
              closedObj["count"] = 6;
              closedObj["result"] = results[index].result;
              portscanner.closedNetwork.push(closedObj);
            }
          }
          console.log(portscanner.networkList.length);
          //portscanner.scanStartFnc();
          portscanner.start();
        }
      });
      connection.release();

    }
  });
}

/* 운영시 네트워크 주석 제거 */
startScanner();

function updateNetList() {
  var _query = queryconfig.selectAll();

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      throw err;
    } else {
      connection.query(_query, (err, results) => {
        if (err) {
          console.log(err)
          throw err;
        } else {
          portscanner.networkList = results;
        }
      });
      connection.release();

    }
  });
}

/* 운영시 네트워크 주석 제거 */
var selectInterval = setInterval(updateNetList, 30000);

//조회
router.get('/', function (req, res, next) {
  var _this = this;
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
          portscanner.networkList = results;

          for (i in results) {
            results[i]['record_time'] = results[i]['record_time'] ? moment(results[i]['record_time']).format() : null;
            results[i]['error_time'] = results[i]['error_time'] ? moment(results[i]['error_time']).format() : null;
          }
          res.json(results);
        }
      });
      connection.release();

    }
  });
});

router.get('/site', function (req, res, next) {
  // console.log(req);
  var _query = queryconfig.findGroupBynetwork();
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).end();
      throw err;
    } else {
      connection.query(_query, (err, results) => {
        if (err) {
          res.status(404).end();
        } else {
          res.json(results);
        }
      });
      connection.release();

    }
  });
});

// 사이트에 등록된 장비 리스트 조회
router.get('/site/:siteId', function (req, res, next) {
  var _siteId = req.params.siteId;
  var _query = queryconfig.findGroupBynetworkNsite(_siteId);

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).end();
      throw err;
    } else {
      connection.query(_query, (err, results) => {
        if (err) {
          res.status(404).end();
        } else {

          res.json(results);
        }
      });
      connection.release();

    }
  });
});

// 등록 된 네트워크의 장비 타입별 수
/* 
  @commant ODEMS 전체통계-장비 등록 현황
*/
router.get('/device/registed/count', function (req, res, next) {
  var _query = queryconfig.findBydeviceCount();
  console.log(_query);
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).end();
      throw err;
    } else {
      connection.query(_query, (err, results) => {
        if (err) {
          res.status(404).end();
        } else {
          res.json(results);
        }
      });
      connection.release();

    }
  });
});
// 현장별 등록 된 네트워크의 장비 타입별 수
/* 
  @params siteId 현장ID
  @commant ODEMS 현장별 통계-장비 등록 현황
*/
router.get('/device/registed/count/:siteId', function (req, res, next) {
  var param = req.params.siteId;
  var _query = queryconfig.findBydeviceCountNsiteId(param);
  console.log(_query);
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).end();
      throw err;
    } else {
      connection.query(_query, (err, results) => {
        if (err) {
          res.status(404).end();
        } else {
          res.json(results);
        }
      });
      connection.release();

    }
  });

});

// error watch
router.get('/error', function (req, res, next) {

  console.log(">>>>", portscanner.closedNetwork);
  res.json(portscanner.closedNetwork);

});

//사이트 별 조회
router.get('/:siteId', function (req, res, next) {
  var _this = this;
  var _siteId = req.params.siteId;
  var _query = queryconfig.siteSelect(_siteId);
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
          console.log(results);
          for (i in results) {
            results[i]['record_time'] = results[i]['record_time'] ? moment(results[i]['record_time']).format() : null;
            results[i]['error_time'] = results[i]['error_time'] ? moment(results[i]['error_time']).format() : null;
          }
          res.json(results);
        }
      });
      connection.release();

    }
  });

});

//디바이스 조회
/* 
  @param deviceId
  @commant ODMS UPS이력 조회-ups장비 조회
*/
router.get('/device/:deviceId', function (req, res, next) {
  var _this = this;
  var _deviceId = req.params.deviceId;
  var _query = queryconfig.findBydevice(_deviceId);

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
    @body url
    @body port 
    @body neType
    @body location
    @body siteId
    @body result
*/
router.post('/', function (req, res, next) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  var _reqBody = req.body;
  _reqBody.createDate = date;
  console.log(_reqBody);
  var _query = queryconfig.insert(_reqBody);
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
          console.log(results);
          portscanner.networkList.push(results);
          res.json(results);
        }
      });
      connection.release();

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
router.put('/:id', function (req, res, next) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  var reqBody = req.body;
  var _id = req.params.id;

  reqBody.id = _id;
  reqBody.date = date;
  console.log(reqBody)
  var _deviceId = reqBody.deviceId;
  var _query;
  if (_deviceId == 3) {
    _query = queryconfig.update(reqBody)
      + ups_queryconfig.update(reqBody);
  } else {
    _query = queryconfig.update(reqBody);
  }
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

//네트워크 삭제
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
