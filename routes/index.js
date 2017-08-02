var express = require('express');
var router = express.Router();

<<<<<<< HEAD
=======
var config = require('../config.json');

>>>>>>> d8d2650aafdc00571711031ce342cd3e13628caf
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
