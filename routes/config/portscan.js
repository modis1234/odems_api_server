var portscanner = require('../lib/portscanner');
var network_queryconfig = require('../query/network_query');
var error_queryconfig = require('../query/error_query');
const pool = require('../config/connection');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const _portScanner = {
  networkList: [],
  closedNetwork: [],
  start: function () {
    var _this = this;
    console.log(_this.networkList);


    timer = setInterval(function () {
      var _network = _this.networkList;
      for (var i = 0; i < _network.length; i++) {
        var scanObj = {};

        if (_network[i].device_name !== 'UPS') {
          scanObj.id = _network[i].id;
          scanObj.url = _network[i].url;
          scanObj.port = _network[i].port;
          scanObj.deviceId = _network[i].device_id;
          scanObj.location = _network[i].location;
          scanObj.siteId = _network[i].site_id;
          scanObj.deviceIndex = _network[i].device_index;
          _this.portScan(scanObj);

        }
      }

    }, 15000);
  },
  stop: function () {
    console.log("stop");
    clearInterval(this.timer);
  },
  portScan: function (scanObj) {
    var _this = this;
    var _ip = scanObj.url;
    var _port = scanObj.port;

    portscanner.checkPortStatus(_port, _ip, function (error, status) {
      // Status should be 'open' since the HTTP server is listening on that port
      var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
      scanObj.date = date;
      scanObj.result = status;
      if (status === "open") {
        //1.closedNetwork에 데이터 있는지 확인
        var openIdx = _this.closedNetwork.findIndex((item, idx) => {
          return item.id === scanObj.id;
        });
        //1-1 closedNetwork에 데이터가 있다면, closedNetwork에서 제거
        //closed --> open
        if (openIdx > -1) {
          var closedObj = _this.closedNetwork[openIdx];
          var deviceId = closedObj['deviceId'];
          var gasConunt;
          var deviceCount;
          if (deviceId == 7) {
            gasConunt = closedObj['count'];
          } else {
            deviceCount = closedObj['count'];
          }
          var _count = closedObj.count;
          closedObj.recordTime = date;
          closedObj.restoreTime = date;
          closedObj.result = 'open'
          //closedObj.count=0;
          closedObj.count = closedObj['count'];
          if (deviceCount >= 3 && deviceCount != undefined) {
            _this.restore(closedObj);
          }
          else if (gasConunt >= 10 && gasConunt != undefined) {
            _this.restore(closedObj);
          }
          if (closedObj.timeoutId) {
            clearTimeout(closedObj.timeoutId);
          }
          _this.closedNetwork.splice(openIdx, 1);

        } else if (openIdx === -1) {
          //console.log(">>open 없다--->",openIdx);
        }
        scanObj.errorTime = null
        _this.resultUpdate(scanObj);

      }
      else if (status === "closed") {
        //2.closedNetwork에 데이터 있는지 확인
        var closeIdx = _this.closedNetwork.findIndex((item, idx) => {
          return item.id === scanObj.id;
        });
        //2-1. closedNetwork에 없다면
        //open --> closed
        if (closeIdx === -1) {
          errorObj = {};
          errorObj = scanObj;
          errorObj["errorTime"] = null;
          errorObj["count"] = 0;
          scanObj['result'] = 'open';
          //2-1-1. closedNetwork에 등록
          _this.closedNetwork.push(errorObj);
        }
        else if (closeIdx > -1) {
          var closedObj = _this.closedNetwork[closeIdx];
          closedObj.count += 1;
          var deviceId = closedObj['deviceId'];
          var gasConunt;
          var deviceCount;
          if (deviceId == 7) {
            gasConunt = closedObj['count'];
          } else {
            deviceCount = closedObj['count'];
          }

          if (deviceCount === 3) {
            console.log('setTIme!!');
            closedObj.recordTime = date;
            closedObj.errorTime = date;
            closedObj.timeoutId = setTimeout(function () {
              closedObj.result = 'closed';
              scanObj.result = 'closed'
              _this.insertError(closedObj);
            }, 60000);

          }
          else if (gasConunt === 10) {
            console.log('setTIme!!');
            closedObj.recordTime = date;
            closedObj.errorTime = date;
            closedObj.timeoutId = setTimeout(function () {
              closedObj.result = 'closed';
              scanObj.result = 'closed'
              _this.insertError(closedObj);
            }, 60000);
          }
          if (deviceCount < 3 && deviceCount != undefined) {
            scanObj.result = 'open'
          }
          else if (gasConunt < 10 && gasConunt != undefined) {
            scanObj.result = 'open'
          }

          console.log('closedObj-->', closedObj);
        }
        //3. 해당 id에 errorNetwork 데이터 가져온다.
        var errTime = _this.closedNetwork.find(item => item.id === scanObj.id) || {};
        if (errTime.errorTime) {
          //3-1. closedNetwork에 찍는다.
          scanObj.errorTime = '"' + errTime.errorTime + '"';
        }
        _this.resultUpdate(scanObj);


      }
      if (error) {
        return;
      }
    }); // end portscan
  },
  resultUpdate: function (scanObj) {
    var _result = scanObj.result;

    var _query = network_queryconfig.scanResult(scanObj);
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        throw err;
      } else {
        connection.query(_query, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            var _recordTime = scanObj.date;
            var _url = scanObj.url;
            var _port = scanObj.port;
          }
        });
        connection.release();

      }
    });
  },
  insertError: function (data) {
    var errorObj = data;
    var _query = error_queryconfig.insert(errorObj);
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        throw err;
      } else {
        connection.query(_query, (err, results) => {
          if (err) {
            console.log(err)
          }
        });
        connection.release();

      }
    });
  },
  restore: function (data) {
    //console.log("restore---->>>",data);
    var _query = error_queryconfig.restoreUpdate(data);
    console.log(_query);
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        throw err;
      } else {
        connection.query(_query, (err, results) => {
          if (err) {
            console.log(err)
          }
        });
        connection.release();

      }
    });

  }
};

module.exports = _portScanner;
