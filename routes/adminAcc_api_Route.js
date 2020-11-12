var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require('./config/database');
var queryconfig = require('./query/adminAcc_query');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var crypto = require('crypto');

// var conn = mysql.createConnection(dbconfig);
const pool = require('./config/connection');

// 로그인 
/*
    @body userId
    @body password
*/
router.post('/login', function (req, res, next) {
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
                if (err) {
                    console.log(err);
                    res.status(404).end();
                    throw err;
                } else {
                    if (results.length === 0) {
                        res.json({ success: false, msg: '해당 유저가 존재하지 않습니다.' });
                    } else {
                        if (securityPW !== results[0].password) {
                            res.json({ success: false, msg: '비밀번호가 일치하지 않습니다.' });
                        } else {
                            res.json({ success: true, user: results });
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
router.post('/', function (req, res, next) {
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
                if (err) {
                    res.status(404).end();
                } else {
                    res.json(results[0]);
                }
            });
            connection.release();

        }
    });
});



module.exports = router;
