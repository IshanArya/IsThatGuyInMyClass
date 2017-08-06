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
                }, function(err, user) {
                    if (err) {
                        res.json({
                            success: false,
                            message: "User with email " + email + " not found."
                        });
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    } else {
        res.json({
            success: false,
            message: "No web token provided."
        });
    }
});

router.get('/verify', function(req, res) {
    req.user.verified = true;
    req.user.save(function(err) {
        if (err) {
            next(err);
        } else {
            res.render('verified', {
                user: req.user
            });
        }
    });
});

router.get('/schedule', function(req, res) {
	res.render("schedule", {
        student: req.user
    });
});

module.exports = router;
