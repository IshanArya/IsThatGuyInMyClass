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

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/forgotmypassword', function(req, res) {
    res.render('forgotmypassword');
});

router.get('/registered', function(req, res) {
    res.render('registered');
});

router.get('/verify', function(req, res) { //needs to be here 
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
                            res.render('emailhaschanged');
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
                            res.render('emailwaschanged');
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

router.get('/changepassword', function(req, res) {
    res.render('changepassword', {
        token: req.token
    });
});

module.exports = router;
