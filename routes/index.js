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
                req.decoded = decoded;
                next();
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
    
});


router.get('/schedule', function(req, res) {
    Student.findOne({
        email: req.decoded
    }, function(err, user) {
        if(err) {
            res.json({
                success: false,
                message: err.message
            });
        } else {
            res.render("schedule", {
                student: user._doc
            });
        }
    });
	
});

module.exports = router;
