var express = require('express');
var jsonwebtoken = require('jsonwebtoken');
var router = express.Router();

var config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/register', function(req, res) {
	
});

module.exports = router;
