var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var Student = require('../model/student');
var path = require('path');
var router = express.Router();

var secret = config.secret;

router.get('/', function(req, res) {
    res.render('index');
});

// var routesWithoutTokens = ['login', 'register', 'registered', 'reverify', 'namechanged', 'emailchanged', 'emailwaschanged'];
// for (var i = 0; i < routesWithoutTokens.lengths; i++) {
//     router.get(routesWithoutTokens[i], function(req, res) {
//         res.render(routesWithoutTokens[i]);
//     })
// }

router.get('/login', function(req, res) {
    res.render('login');
});
router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/registered', function(req, res) {
    res.render('registered');
});
router.get('/reverify', function(req, res) {
    res.render('reverify');
});
router.get('/namechanged', function(req, res) {
    res.render('namechanged');
});
router.get('/emailchanged', function(req, res) {
    res.render('emailchanged');
});
router.get('/emailwaschanged', function(req, res) {
    res.render('emailwaschanged');
});

router.get('/verify', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                res.redirect('/login');
            } else {
                Student.findOne({
                    email: decoded
                }, function(err, student) {
                    if (err) {
                        res.redirect('/login');
                    } else {
                        if(student) {
                            student.verified = true;
                            student.save(function(err) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.render('verified', {
                                        student: student
                                    });
                                }
                            });
                        } else {
                            res.redirect('/emailhaschanged');
                        }
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});


router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                res.redirect('/login');
                // res.json({
                //     success: false,
                //     message: "Failed to authenticate token."
                // });
            } else {
                // req.decoded = decoded;
                Student.findOne({
                    email: decoded
                }, function(err, student) {
                    if (err) {
                        res.redirect('/login');
                        // res.json({
                        //     success: false,
                        //     message: "Student with email " + email + " not found."
                        // });
                    } else {
                        if(student) {
                            console.log(student.verified);
                            if(student.verified) {
                                req.student = student;
                                req.token = token;
                                next();
                            } else {
                                res.render('unverified', {
                                    student: student
                                });
                            }
                        } else {
                            res.redirect('/emailwaschanged');
                        }
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
        // res.json({
        //     success: false,
        //     message: "No web token provided."
        // });
    }
});

router.get('/schedule', function(req, res) {
	res.render("schedule", {
        student: req.student,
        token: req.token
    });
});

router.get('/update_profile', function(req, res) {
    res.render("update_profile", {
        student: req.student,
        token: req.token 
    });
});

router.get('/friends', function(req, res) {
    req.student.findFriends(function(friends) {
        res.render("friends", {
            student: req.student,
            token: req.token,
            friends: friends
        });
    });
});

module.exports = router;
