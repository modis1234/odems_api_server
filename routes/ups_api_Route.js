var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/ups_query');
var error_queryconfig = require('./query/error_query');
var network_queryconfig = require('./query/network_query');

// 알람 config
var alarm = require('./config/alarm');

const pool = require('./config/connection');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var networkInfoList;
function networkUpsInfo() {
    var _query = queryconfig.selectNetworkInfo();
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    networkInfoList = results;
                }
            });
            connection.release();

        }
    });
}

networkUpsInfo();

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

// ups_devcie_view 테이블 조회 라우터
/* 
    @param siteId
*/
router.get('/device/:siteId', function (req, res, next) {
    let siteId = req.params.siteId;
    var _query = queryconfig.upsDeviceSelect(siteId);

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

// 입력
/*
    @body localIdx
    @body companyId
    @body locationId

*/
router.post('/', function (req, res, next) {
    var createdDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    _body.createdDate = createdDate;

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
  @body siteName
  @body upsName
*/
router.put('/:id', function (req, res, next) {
    var _id = req.params.id;
    var _body = req.body;
    _body.id = _id;
    // console.log(_body);
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
  @param index
*/
router.delete('/:index', function (req, res, next) {
    var _index = req.params.index;

    var _query = queryconfig.delete(_index);
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

// ups_error- 검색
/* 
  @body startDate
  @body endDate
  @body localIndex
  @body upsIndex(필수 x)
*/
router.post('/error/search', function (req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss');

    var reqBody = req.body;
    var _upsIndex = reqBody.upsIndex || null;

    var _query;
    if (_upsIndex) {
        _query = queryconfig.errorfindBytermNlocalIndexNupsIndex(reqBody);
    } else {
        _query = queryconfig.errorfindBytermNlocalIndex(reqBody);
    }


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
                    for (i in results) {
                        results[i]['record_time'] = results[i]['record_time'] ? moment(results[i]['record_time']).format() : null;
                        results[i]['blackout_time'] = results[i]['blackout_time'] ? moment(results[i]['blackout_time']).format() : null;
                        results[i]['discharge_time'] = results[i]['discharge_time'] ? moment(results[i]['discharge_time']).format() : null;
                        results[i]['error_time'] = results[i]['error_time'] ? moment(results[i]['error_time']).format() : null;
                        results[i]['restore_time'] = results[i]['restore_time'] ? moment(results[i]['restore_time']).format() : null;

                    }
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

//UPS 데이터 처리
/* 
    @body local_idx
    @body volt_in
    @body volt_out
    @body freq_in
    @body freq_out
    @body loaded
    @body battery_remain
    @body state_battery
    @body state_line
    @body state_avr
*/

var upsObj = {};
var errorObj = {};
router.post('/status', function (req, res, next) {
    var _query;
    var recordTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    var _idx = _body[0].ups_idx;
    _body[0].recordTime = recordTime;
    _body[0].result = "open";
    _body[0].errorTime = null;
    networkResult(_body[0]);
    // 장애 판단 로직   
    // enums 0=정전/1=방전/2=네트워크장애
    // 1. 정전(state_line=1)
    var stateLine = parseInt(_body[0].state_line);
    var stateBattery = parseInt(_body[0].state_battery);
    var network = networkInfoList.filter(function (obj) {
        if (obj.device_index === _idx) {
            return obj;
        }
    });
    var deviceInfo = network[0];
    deviceInfo.sendYN = 'N';
    var _totalBattery = deviceInfo.battery_capacity; // 총배터리량
    var _maxUsedPower = deviceInfo.max_power; // 최대사용가능 전력
    console.log('network--->', deviceInfo);
    _body[0]['site_id'] = deviceInfo['site_id'];
    _body[0]['location'] = deviceInfo['location'];
    if (stateLine === 1) {
        var _blackOutBody = _body[0];
        _blackOutBody.recordTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        _blackOutBody.blackoutTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        _blackOutBody.errorType = 1;

        // 배터리 사용가능시간 계산식
        var _powerEfficiency = _maxUsedPower * 0.7; // 전력사용효율
        var _batteryRemain = _body[0].battery_remain; // 배터리 잔량(%)
        var _batteryUseEfficiency = (_batteryRemain - 30) / 100; // 배터리 사용 효율
        var _loaded = _body[0].loaded; //전력 사용률(%)
        if (_batteryUseEfficiency > 0) {
            var _batteryRemainVolume = _totalBattery * _batteryUseEfficiency; // 시간 계산용 배터리 용량   
            var _usedPower = _powerEfficiency * _loaded / 100 // 전력 사용량
            var _buttreryTime = _batteryRemainVolume / _usedPower;
            var powerUsedTime = Math.round((_buttreryTime) * 100) / 100; //전원사용가능시간
            _blackOutBody.useTime = powerUsedTime;
            //시간 변환    
            var usedTime = String(powerUsedTime);
            var subTime = usedTime.split('.');
            var usedHour = subTime[0];
            if (subTime[1]) {
                var subMin = (subTime[1].length !== 1) ? subTime[1] : subTime[1] + "0";
                var usedMinute = Math.round(60 * (subMin / 100));
                console.log(usedHour, '시간', usedMinute, '분')
            } else {
                console.log(usedHour, '시간')
            }
            _body[0].useTime = powerUsedTime;
        } else if (_batteryUseEfficiency <= 0) {
            _body[0].useTime = 0;
        } // end 시간 계산
        //정전발생 이력 기록
        var upsBlackoutList = {};
        if (!errorObj.hasOwnProperty(_idx)) {
            console.log('true!!');
            errorObj[_idx] = _blackOutBody;
            console.log('_blackOutBody->', _blackOutBody);
            errorObj[_idx].timeoutId = setTimeout(function () {

                _query = queryconfig.error_blackout(_blackOutBody);
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
                                console.log("blackout!!");
                            }
                        });
                        connection.release();

                    }
                });

                _body[0].errorType = 1;
                resultScan(_body[0]);

                // 알림메시지 전송
                var blackOutObj = {};
                blackOutObj.deviceIndex = _blackOutBody.ups_idx;
                blackOutObj.errorType = _blackOutBody.errorType;
                blackOutObj.useTime = _blackOutBody.useTime;
                alarm.send(blackOutObj);
            }, 60000); // 1분후 정전 장애 이력 등록 및 정전 상태 메세지 전송
        } else if (errorObj.hasOwnProperty(_idx)) {
            errorObj[_idx]['battery_remain'] = _blackOutBody['battery_remain'];
            errorObj[_idx]['useTime'] = _blackOutBody['useTime'];
            errorObj[_idx]['result'] = _blackOutBody['result'];

            // errorObj[_idx] = _blackOutBody;
            var _errorType = _body[0].errorType;
            if (_errorType == 1) {
                console.log('정전->', _body[0]);
                resultScan(_body[0]);
            }
        }
        insertLog(_body[0]);

    } // end  정전 발생(stateLine = 1)
    else if (stateLine === 0) {

        //정전 후 정상 복구 이력 기록
        var recordTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        var errorHasProperty = errorObj.hasOwnProperty(_idx);
        if (errorHasProperty) {
            console.log('errorObj[_idx]--->>', errorObj[_idx]);
            clearTimeout(errorObj[_idx].timeoutId);
            var restoreObj = _body[0];
            restoreObj.recordTime = recordTime;
            restoreObj.restoreTime = recordTime;
            restoreObj.blackoutTime = errorObj[_idx].blackoutTime;
            restoreObj.errorType = 1;
            errorObj[_idx].restoreTime = recordTime;
            errorObj[_idx].count = null;
            errorObj[_idx].result = 'open';
            if (errorObj[_idx].errorType != 1) { // 정전 일떄는 네트워크 상태 정상
                networkRestore(errorObj[_idx]);
            }
            delete errorObj[_idx];
            upsErrorRestore(restoreObj);
        }
        _body[0].errorType = 0;

        insertLog(_body[0]);
        console.log('정상->', _body[0]);
        resultScan(_body[0])
    } // end 정전 복구(stateLine = 0)

    var hasProperty = upsObj.hasOwnProperty(_idx);
    var count = 20;
    if (!hasProperty) {
        _body[0].receiveTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        _body[0].counter = setInterval(upsHandler, 1000);
        upsObj[_idx] = _body[0];
    } else {
        clearInterval(upsObj[_idx].counter);
        _body[0].receiveTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        _body[0].counter = setInterval(upsHandler, 1000);
        upsObj[_idx] = _body[0];
    }
    // console.log(upsObj[_idx])
    res.end();

    function upsHandler() {
        var _this = this;
        var _cnt = count--;
        //console.log(_cnt);
        if (count <= 0) {
            clearInterval(_body[0].counter);
            console.log("2.PHPoC 장애!!!!!");

            // 3. 네트워크 단절(_body[0]이 20초 이상 들어오지 않는다.)
            // ups 장비 문제?? 네트워크 문제???
            var stateLine = parseInt(upsObj[_idx].state_line);
            var stateBattery = parseInt(upsObj[_idx].state_battery);
            console.log(stateLine, "/", stateBattery)
            if (stateLine === 1 && stateBattery === 1) {
                console.log("방전!!!");
                var errHasProperty = errorObj.hasOwnProperty(_idx);
                if (errHasProperty) {
                    //방전
                    var dischargeObj = upsObj[_idx];
                    var recordTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                    dischargeObj.recordTime = recordTime;
                    dischargeObj.dischargeTime = recordTime;
                    dischargeObj.blackoutTime = errorObj[_idx].blackoutTime;
                    dischargeObj.errorType = 2;
                    errorObj[_idx].recordTime = recordTime;
                    errorObj[_idx].dischargeTime = recordTime;
                    errorObj[_idx].errorType = 2;
                    deviceInfo.recordTime = recordTime;
                    deviceInfo.result = 'closed';
                    deviceInfo.errorTime = recordTime;

                    networkError(deviceInfo);
                    _query = queryconfig.error_discharge(dischargeObj);
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
                                    console.log("discharge!!!!!!!!")
                                }
                            });
                            connection.release();

                        }
                    });
                }
                upsObj[_idx].errorType = 2;
                upsObj[_idx].result = 'closed',
                    console.log("방전!!!>>>>>>>", upsObj[_idx])
                resultScan(upsObj[_idx]);
                var disChargeObj = {};
                disChargeObj.deviceIndex = upsObj[_idx].ups_idx;
                disChargeObj.errorType = upsObj[_idx].errorType;
                alarm.send(disChargeObj);
                deviceInfo.sendYN = 'Y';

            }
            else if (stateBattery !== 1) {
                console.log("네트워크 장애!!!");
                console.log('body->', _body[0])
                var recordTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                deviceInfo.recordTime = recordTime;
                deviceInfo.errorTime = recordTime;
                deviceInfo.result = 'closed';
                deviceInfo.ups_idx = deviceInfo.device_index;
                deviceInfo.local_idx = _body[0].local_idx;
                console.log("deviceInfo--->>>>", deviceInfo);


                upsObj[_idx].errorType = 3;
                upsObj[_idx].result = 'closed',
                    upsObj[_idx].errorTime = recordTime;
                console.log("네트워크 장애!!!>>>>>>>", upsObj[_idx])

                // networkError(deviceInfo); // 네트워크 장애 이력
                // networkResult(deviceInfo); // 네트워크 상태 
                // resultScan(upsObj[_idx]); // ups 상태 

                var networErrkObj = {};
                networErrkObj.deviceIndex = upsObj[_idx].ups_idx;
                networErrkObj.errorType = upsObj[_idx].errorType;

                deviceInfo.deviceId = 3;
                deviceInfo.errorType = 3;

                errorObj[_idx] = deviceInfo;
                console.log('deviceInfo-->>>', deviceInfo);
                errorObj[_idx].timeoutId = setTimeout(function () {
                    networkError(deviceInfo); // 네트워크 장애 이력
                    networkResult(deviceInfo); // 네트워크 상태 
                    resultScan(upsObj[_idx]); // ups 상태 
                    // 알림메시지 전송
                    alarm.send(networErrkObj);
                }, 60000);

            }
            return;
        }
    } // end upsHandler

});

function insertLog(data) {
    var _data = data;
    _data.recordTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _query = queryconfig.insert_log(_data);
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
                    //res.json(rows);
                    //console.log(rows);
                }
            });
            connection.release();

        }
    });
}

function resultScan(data) {
    var _data = data;
    var _query = queryconfig.recordUpdate(_data);
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
                    //res.json(rows);
                    //console.log(rows);
                }
            });
            connection.release();

        }
    });
}


function upsErrorRestore(data) {
    var _data = data;
    _query = queryconfig.error_restore(_data);
    console.log(_query)
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
                    console.log("정상 복구!!!!")
                }
            });
            connection.release();

        }
    });
}


function networkError(data) {
    var _data = data;
    var _query = error_queryconfig.insert(data) + queryconfig.error_network(data);
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
                    //res.json(rows);
                    //console.log(rows);
                }
            });
            connection.release();

        }
    });
}

function networkRestore(data) {
    var _data = data;
    console.log('0.data--->>>>', data);

    // var _query = error_queryconfig.restoreUpdate(data);
    var _query = error_queryconfig.restoreUpdate(data) + queryconfig.network_restore(data)
    console.log(_query);
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
                    //res.json(rows);
                    //console.log(rows);
                }
            });
            connection.release();

        }
    });
}

function networkResult(data) {
    var _data = data;
    var _query = network_queryconfig.upsNetworkUpdate(_data);
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
                    //res.json(rows);
                    //console.log(rows);
                }
            });
            connection.release();

        }
    });
}


router.post('/calc', function (req, res, next) {
    var reqBody = req.body;
    var batterRemain = reqBody.battery_remain;
    var load = reqBody.load;

    var totalBattery = 170; // 총배터리량
    var maxUsedPower = 1000; // 순간 최대사용가능 전력

    var 전력사용효율 = (maxUsedPower * 70) / 100;
    var 배터리사용효율 = (batterRemain - 30) / 100;
    //var 배터리사용효율 = totalBattery*60/100;

    var 시간계산용배터리용량 = totalBattery * 배터리사용효율;
    // var 시간계산용배터리용량 = 배터리사용효율*batterRemain/100;

    var 전력사용량 = 전력사용효율 * load / 100;
    var 전원사용가능시간 = 시간계산용배터리용량 / 전력사용량;
    var powerUsedTime = Math.round((전원사용가능시간) * 100) / 100; //전원사용가능시간

    console.log('전원사용가능시간->', 전원사용가능시간);
    //시간 변환    
    var usedTime = String(powerUsedTime);
    var subTime = usedTime.split('.');
    var usedHour = subTime[0];
    if (subTime[1]) {
        var subMin = (subTime[1].length !== 1) ? subTime[1] : subTime[1] + "0";
        var usedMinute = Math.round(60 * (subMin / 100));
        console.log(usedHour, '시간', usedMinute, '분')
    } else {
        console.log(usedHour, '시간')
    }
    res.json(전원사용가능시간);

});

router.get('/odms/status', function (req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var _query = queryconfig.upsCurrentView();

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
                    for (i in results) {
                        results[i]['record_time'] = results[i]['record_time'] ? moment(results[i]['record_time']).format() : null;
                        results[i]['error_record_time'] = results[i]['error_record_time'] ? moment(results[i]['record_time']).format() : null;
                        results[i]['restore_time'] = results[i]['restore_time'] ? moment(results[i]['restore_time']).format() : null;
                        results[i]['blackout_time'] = results[i]['blackout_time'] ? moment(results[i]['blackout_time']).format() : null;
                        results[i]['discharge_time'] = results[i]['discharge_time'] ? moment(results[i]['discharge_time']).format() : null;
                        results[i]['error_time'] = results[i]['error_time'] ? moment(results[i]['error_time']).format() : null;
        
                    }
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

// 검색 
/* 
  @body startDate
  @body endDate
  @body companyId
  @body siteId
  @body location
  @commant ODMS UPS 이력 검색
*/
router.post('/odms/error/search', function (req, res, next) {
    var reqBody = req.body;
    var companyId = reqBody.companyId;
    var siteId = reqBody.siteId;
    var location = reqBody.location;

    var query;
    // 기간&건설사( companyId=true, siteId=false, location=false )
    if (companyId != undefined & !siteId & !location) {
        console.log("기간&건설사");
        query = queryconfig.findByTermNCompany(reqBody);
    }
    // 기간&현장( companyId=false, siteId=true, location=false )
    else if (!companyId & siteId != undefined & !location) {
        console.log("기간&현장");
        query = queryconfig.findBytermNsiteId(reqBody);
    }
    // 기간&설치위치( companyId=false, siteId=false, location=true )
    else if (!companyId & !siteId & location != undefined) {
        console.log("기간&설치위치");
        query = queryconfig.findByTermNlocation(reqBody);
        console.log(query)
    }
    // 기간&건설사&현장( companyId=true, siteId=true, location=false )
    else if (companyId != undefined & siteId != undefined & !location) {
        console.log("기간&건설사&현장");
        query = queryconfig.findByTermNcompanyNsite(reqBody);
    }
    // 기간&건설사&설치위치( companyId=true, siteId=false, location=true )
    else if (companyId != undefined & !siteId & location != undefined) {
        console.log("기간&건설사&설치위치");
        query = queryconfig.findByTermNcompanyNlocation(reqBody);
    }
    // 기간&현장&설치위치( companyId=false, siteId=true, location=true )
    else if (!companyId & siteId != undefined & location != undefined) {
        console.log("기간&현장&설치위치");
        query = queryconfig.findBytermNlocationNsiteId(reqBody);
    }
    // 기간&건설사&현장&설치위치 ( companyId=true, siteId=true, location=true )
    else if (companyId != undefined & siteId != undefined & location != undefined) {
        console.log("기간&건설사&현장&설치위치");
        query = queryconfig.findByTermNcompanyNsiteNlocation(reqBody);
    }
    // 기간( companyId=false, siteId=false, location=false )
    else if (!companyId & !siteId & !location) {
        console.log("기간");
        query = queryconfig.findByTerm(reqBody);
        console.log(query);
    }
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(query, (err, results) => {
                if (err) {
                    res.status(404).end();
                } else {
                    console.log(results);
                    var rowsLeng = results.length;
                    if (rowsLeng) {
                        for (i in rows) {
                            results[i]['record_time'] = results[i]['record_time'] ? moment(results[i]['record_time']).format() : null;
                            results[i]['error_time'] = results[i]['error_time'] ? moment(results[i]['error_time']).format() : null;
                            results[i]['restore_time'] = results[i]['restore_time'] ? moment(results[i]['restore_time']).format() : null;
                            results[i]['blackout_time'] = results[i]['blackout_time'] ? moment(results[i]['blackout_time']).format() : null;
                            results[i]['discharge_time'] = results[i]['discharge_time'] ? moment(results[i]['discharge_time']).format() : null;
        
                        }
                        res.json(results);
                    } else {
                        res.json(results);
                    }
                }
            });
            connection.release();

        }
    });
});





module.exports = router;
