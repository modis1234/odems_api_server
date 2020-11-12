var request = require('request');
var mysql = require("mysql");
var queryconfig = require('../query/alarm_query');

var dbconfig = require('../config/database');
var conn = mysql.createConnection(dbconfig);

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const _alarm = {
    server:'http://127.0.0.1:8099',
    send: function(obj) {
        var _this = this;
        var _obj = obj;
        var _deviceIndex = _obj.deviceIndex;
        var _errorType = _obj.errorType;
        var _useTime = _obj.useTime || 0;
        var _query = queryconfig.selectDeviceIdx(_deviceIndex);
        conn.query(_query, function(error, rows, fields){
            if(error){
                console.error();
            } else {
               // var delaySec = 500;
                for( i in rows){
                    var sendObj = {};
                    sendObj.errorType = _errorType;
                    sendObj.recordTime = rows[i]["record_time"];
                    sendObj.location = rows[i]["location"];
                    sendObj.name = rows[i]["name"];
                    sendObj.tel = rows[i]["tel"];
                    sendObj.useTime = _useTime || 0;

                    _this.sendHandler(sendObj);

                }
            }
        });
      
    },
    sendHandler: function(obj){
        var errorType = obj["errorType"];
        var useTime = String(obj["useTime"]);
        var subTime = useTime.split('.');
        var usedHour = subTime[0];
        if(subTime[1]){
            var subMin = (subTime[1].length !== 1)?subTime[1]:subTime[1]+"0";
            var usedMinute = Math.round(60 * (subMin/100));
            var usedTime = usedHour*60+usedMinute;
            obj["useTime"] = usedTime;
        }else {
            var usedTime = usedHour*60;
            obj["useTime"] = usedTime;
        }
       // this.blackout(obj);
        if(errorType === 1){
            this.blackout(obj);
        }
        else if(errorType === 2){
            this.discharge(obj);

        }
        else if(errorType === 3){
            this.networkErr(obj);

        }
    },
    blackout: function(obj){
        var _postURL = this.server + '/alarm/blackout';
        request.post({
            url: _postURL,
            body: {
                destPhone : obj.tel,
                sendPhone : obj.tel,
                recordTime : obj.recordTime,
                useTime : obj.useTime,
                location : obj.location
            },
            json:true}, function(error, res, body){
            
        });
    },
    discharge: function(obj){
        var _postURL = this.server + '/alarm/discharge';
        request.post({
            url: _postURL,
            body: {
                destPhone : obj.tel,
                sendPhone : obj.tel,
                recordTime : obj.recordTime,
                useTime : obj.useTime,
                location : obj.location
            },
            json:true}, function(error, res, body){
            
        });
    },
    networkErr: function(obj){
        var _postURL = this.server + '/alarm/network';
        request.post({
            url: _postURL,
            body: {
                destPhone : obj.tel,
                sendPhone : obj.tel,
                recordTime : obj.recordTime,
                location : obj.location
            },
            json:true}, function(error, res, body){
            
        });
    }

};

module.exports = _alarm;
