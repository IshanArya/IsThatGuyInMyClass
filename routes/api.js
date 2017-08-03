var express = require('express');
var mongoose = require('mongoose');
var Student = require('../model/student');
var config = require('../config')
var jwt = require('jsonwebtoken');
var router = express.Router();


var secret = config.secret;


router.post('/register', function(req, res) {
    Student.findOne({
        email: req.body.email
    }, function(err, user) {
        if(err) {
            res.json({
                success: false,
                message: err.message
            });
        } else {
            if(user) {
                res.json({
                    success: false,
                    message: "Email already in use."
                });
            } else {
                var tempUser = new Student({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    verificationToken: getRandomId(),
                    verified: false
                });

                tempUser.save(function(err) {
                    if(err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                    } else {
                        res.json({
                            success: true,
                            message: "Registration successful. Check email."
                        });
                    }
                });
            }
        }
    });
});

router.post('/authenticate', function(req, res) {
    Student.findOne({
        email: req.body.email
    }, function(err, user) {
        if(!user) {
            res.json({
                success: false,
                message: "Authentication failed. User not found."
            });
        } else {
            if(user.password !== req.body.password) {
                res.json({
                    success: false,
                    message: "Authentication failed. Wrong password."
                });
            } else {
                var token = jwt.sign(user, secret, {
                    expiresInMinutes: 1440
                });

                res.json({
                    success: true,
                    message: "Enjoy token!",
                    token: token
                });
            }
        }
    });
});


router.get('/students', function(req, res, next) {
    Student.find(function(err, students) {
        if (err) {
            next(err);
        } else {
            res.json({
                success: true,
                students: students
            });
        }
    });
});

// router.get('/similar', function(req, res) {
//     // 5980c7a55e359d104130ae41
//     var id = req.body.id;
// });

function getRandomId() {
    var dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var num1 = Math.floor(Math.random() * 62);
    var num2 = Math.floor(Math.random() * 62);
    var num3 = Math.floor(Math.random() * 62);
    var num4 = Math.floor(Math.random() * 62);
    var num5 = Math.floor(Math.random() * 62);
    var num6 = Math.floor(Math.random() * 62);
    return dict[num1] + dict[num2] + dict[num3] + dict[num4] + dict[num5] + dict[num6];
}

//this has to be at the bottom
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                return res.json({
                    success: false,
                    message: "Failed to authenticate token."
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
});

router.use(function(req, res) {
    res.json({
        success: false
    });
});

module.exports = router;
