var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/hds/account_query');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var crypto = require('crypto');

const pool = require('./config/connection');



//조회
router.get('/', function(req, res, next) {
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

// 로그인 
/*
    @body userId
    @body password
*/
router.post('/login', function(req, res, next) {
    
    var _body = req.body;
    var _password = _body.password;
    var securityPW = crypto.createHash('sha512').update(_password).digest('base64');
    console.log(securityPW);
    var _query = queryconfig.login(_body);
    console.log(_query);
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
                    if(results.length === 0){
                        res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'});
                    } else {
                        if(securityPW !== results[0].password){
                            res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'});
                        } else {
                            res.json({success: true, user: results});
                        }
                    }
                }
            });
            connection.release();

        }
    });
});

//회원가입
/*
    @body userId
    @body password
    @body name
    @body email
    @body tel
    @body role
    @body smsYN
*/
router.post('/', function(req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    _body.createdDate = date;
    var _password = _body.password;
    var securityPW = crypto.createHash('sha512').update(_password).digest('base64');
    _body.password = securityPW;
    console.log(_body);
    var _query = queryconfig.sign_up(_body);
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
//회원정보수정
/*
  @param id
  @body password
*/
router.put('/:id',function(req, res, next) {
    var _id = req.params.id;
    var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    _body.id = _id;
    _body.modifiedDate = date;
    var _query = queryconfig.infomationUpdate(_body);
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

// 비밀번호 변경
/*
    @param id
    @body password
*/
router.put('/newpassword/:id',function(req, res, next) {
    var _id = req.params.id;
    var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _body = req.body;
    _body.id = _id;
    _body.modifiedDate = date;
    var _password = _body.password;
    var securityPW = crypto.createHash('sha512').update(_password).digest('base64');
    _body.password = securityPW;
    console.log(_body);
    var _query = queryconfig.changePasswordUpdate(_body);
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

// 계정 삭제
/*
  @param id
*/
router.delete('/:id', function(req, res, next){
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

// 알림 수신자 조회
router.get('/receiver/search', function(req, res, next) {
    var _query = queryconfig.receiver_select();
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

// 알림 수신자 등록
/*
    @body name
    @body tel
    @body role : 3 (고정값)
    @body smsYN : Y(고정값)
*/
router.post('/receiver', function(req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var reqBody = req.body;
    reqBody.createdDate = date;
    var _query = queryconfig.receiver_signUp(reqBody);
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

// 알림 수신자 수정
/*
    @param id
    @body name
    @body tel
    @body role : 3 (고정값)
    @body smsYN : Y(고정값)
*/
router.put('/receiver/:id', function(req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    var _id = req.params.id;
    var reqBody = req.body;
    reqBody.id = _id;
    reqBody.modifiedDate = date;
    var _query = queryconfig.receiver_update(reqBody);
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
