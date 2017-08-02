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
                    }

                    res.json({
                        success: true,
                        message: "Registration successful. Check email."
                    });
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
        } else if(user) {
            if(user.password != req.body.password) {
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


router.get('/student', function(req, res, next) {
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

router.get('/similar', function(req, res) {
    // 5980c7a55e359d104130ae41
    var id = req.body.id;
});

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

/*
router.get('/create', function(req, res) {
    var s1 = new Student();
    s1.name = 'Tarun Boddupalli';
    s1.grade = 11;
    s1.classes.push({
        id: 'E1',
        period: '1',
        teacher: 'Fedowitz, Elizabeth',
        room: '195'
    }, {
        id: 'E2',
        period: '2',
        teacher: 'Nasser, Gene',
        room: '235'
    }, {
        id: 'E3',
        period: '3',
        teacher: 'DiOrio, Jennifer',
        room: '135'
    }, {
        id: 'E4',
        period: '4/5',
        teacher: 'Morrow, Denise',
        room: '140'
    }, {
        id: 'E000',
        period: '6',
        teacher: 'Lunch',
        room: 'CAFE'
    }, {
        id: 'E6',
        period: '7/8',
        teacher: 'Hesse, LeeAnne',
        room: '215'
    }, {
        id: 'E7',
        period: '9/10',
        teacher: 'Connell, Robin',
        room: '254'
    }, {
        id: 'E8',
        period: '11',
        teacher: 'Malanga, Something',
        room: '192'
    }, {
        id: 'E9',
        period: '12',
        teacher: 'Leghorn, Brittany',
        room: '007'
    });
    s1.markModified('classes');
    s1.save();

    var s2 = new Student();
    s2.name = 'Bharddwaj Vemulapalli';
    s2.grade = 11;
    s2.classes.push({
        id: 'E11',
        period: '1',
        teacher: 'Evans, Michael',
        room: '252'
    }, {
        id: 'E13',
        period: '2',
        teacher: 'Other, Teacher',
        room: '113'
    }, {
        id: 'E14',
        period: '3',
        teacher: 'Some Other, Teacher',
        room: '130'
    }, {
        id: 'E12',
        period: '4/5',
        teacher: 'Stocker, Focker',
        room: '236'
    }, {
        id: 'E000',
        period: '6',
        teacher: 'Lunch',
        room: 'CAFE'
    }, {
        id: 'E6',
        period: '7/8',
        teacher: 'Hesse, LeeAnne',
        room: '215'
    }, {
        id: 'E7',
        period: '9/10',
        teacher: 'Connell, Robin',
        room: '254'
    }, {
        id: 'E8',
        period: '11',
        teacher: 'Malanga, Something',
        room: '192'
    }, {
        id: 'E10',
        period: '12',
        teacher: 'Frey, Diane',
        room: '227'
    });
    s2.markModified('classes');
    s2.save();

    res.json({
        success: true
    });
});
*/

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
