var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
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


router.get('/schedule', function(req, res) {
	res.render("schedule", {
        student: req.decoded._doc
    });
});

module.exports = router;
