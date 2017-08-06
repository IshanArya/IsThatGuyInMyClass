var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var Student = require('../model/student');
var path = require('path');
var router = express.Router();

var secret = config.secret;

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                res.json({
                    success: false,
                    message: "Failed to authenticate token."
                });
            } else {
                // req.decoded = decoded;
                Student.findOne({
                    email: decoded
                }, function(err, student) {
                    if (err) {
                        res.json({
                            success: false,
                            message: "Student with email " + email + " not found."
                        });
                    } else {
                        req.student = student;
                        req.token = token;
                        next();
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

router.get('/verify', function(req, res) {
    req.student.verified = true;
    req.student.save(function(err) {
        if (err) {
            next(err);
        } else {
            res.render('verified', {
                student: req.student
            });
        }
    });
});

router.get('/profile', function(req, res) {
	res.render("profile", {
        student: req.student,
        token: req.token
    });
});

router.get('/update_profile', function(req, res) {
    res.render("update_profile", {
        student: req.student
    });
});

module.exports = router;
