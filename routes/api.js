var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var mailer = require('nodemailer');
var Student = require('../model/student');
var config = require('../config');
var router = express.Router();


var secret = config.secret;

var transporter = mailer.createTransport(config.mailerTransport);

var sendEmail = {
	verification: function(email, link) {
		transporter.sendMail({
			from: '"Cindr™" <cindrinc@gmail.com>',
			to: email,
			subject: "Just wanted to make sure you exist!",
			text: "Please visit the following link to verify your account: " + link,
			html: '<img width=100 style="float: left; margin-right: 15px" src="https://i.imgur.com/peXjWtg.png"> <p>Thank you for registering with <b>IsThatGuyInMyClass.com</b>. Please visit the following link to verify your account:</p><br><br><a href="' + link + '">' + link + '</a>'
		}, function(err, info) {
			if(err) {
				console.error(err);
			}

			console.log("Message sent: ", info.messageId, info.response);
		});
	},
	password_recovery: function(email, link) {
		transporter.sendMail({
			from: '"Cindr™" <cindrinc@gmail.com>',
			to: email,
			subject: "Recover your account today!",
			text: "Please visit the following link to recover your account: " + link,
			html: '<img width=100 style="float: left; margin-right: 15px" src="https://i.imgur.com/peXjWtg.png"> <p>Forgot your password, I see. No worries! Please visit the following link to verify your account:</p><br><br><a href="' + link + '">' + link + '</a>'
		}, function(err, info) {
			if(err) {
				console.error(err);
			}

			console.log("Message sent: ", info.messageId, info.response);
		});
	}
}


router.post('/register', function(req, res) {
	var email = req.body.email;
	Student.findOne({
		email: email
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
					message: config.errorMessages.emailInUse
				});
			} else {
				var tempUser = new Student({
					email: email,
					password: req.body.password,
					name: req.body.name,
					verified: false,
					admin: false
				});

				tempUser.save(function(err) {
					if(err) {
						res.json({
							success: false,
							message: err.message
						});
					} else {

						var token = jwt.sign(email, secret);
						var link = req.protocol + "://" + req.get('host') + "/verify?token=" + token;
						sendEmail.verification(email, link);

						res.json({
							success: true
						});
					}
				});
			}
		}
	});
});

router.get('/forgotpassword', function(req, res) {
	var email = req.body.email;
	Student.findOne({
		email: email
	}, function(err, user) {
		if(err) {
			res.json({
				success: false,
				message: err.message
			});
		} else {
			if(user) {
				var token = jwt.sign(email, secret);
				var link = req.protocol + "://" + req.get('host') + "/changepassword?token=" + token;
				sendEmail.password_recovery(email, link);

				res.render('recoverysent', {
					student: user
				});
			} else {
				res.render('usernotfound', {
					email: email
				});
			}
		}
	});
});

router.post('/authenticate', function(req, res) {

	Student.findOne({
		email: req.body.email
	}, function(err, user) {

		if(err) {
			res.json({
				success: false,
				message: err.message
			});
		} else {
			if(!user) {

				res.json({
					success: false,
					message: config.errorMessages.noUser
				});
			} else if(user) {
				if(user.password != req.body.password) {
					res.json({
						success: false,
						message: config.errorMessages.wrongPassword
					});
				} else {
					var token = jwt.sign(user.email, secret);

					res.json({
						success: true,
						message: "Enjoy token!",
						token: token
					});

				}
			}
		}
	});
});


router.use(function(req, res, next) {
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
	}
});


router.get('/reverify', function(req, res) {
	var link = req.protocol + "://" + req.get('host') + "/verify?token=" + req.token;

	sendEmail.verification(req.student.email, link);
	res.render('reverify');
});

router.get('/changeemail', function(req, res, next) {
	var student = req.student;
	var newEmail = req.body.email || req.query.email;

	student.verified = false;
	student.email = newEmail;
	student.save(function(err) {
		if (err) {
			next(err);
		} else {
			var newToken = jwt.sign(newEmail, secret);
			var link = req.protocol + "://" + req.get('host') + "/verify?token=" + newToken;
			sendEmail.verification(newEmail, link);
			res.render('emailchanged');
		}
	});
});
router.get('/changename', function(req, res) {
	var student = req.student;
	var newName = req.body.name || req.query.name;

	student.name = newName;
	student.save(function(err) {
		if (err) {
			next(err);
		} else {
			res.render('namechanged');
		}
	});
});
router.post('/changepassword', function(req, res) {
	var student = req.student;
	var newPassword = req.body.password || req.query.password;

	student.password = newPassword;
	student.save(function(err) {
		if (err) {
			next(err);
		} else {
			res.render('passwordchanged');
		}
	});
});
router.post('/changeschedule', function(req, res) {
	var student = req.student;
	var classes = [];
	for (var i = 0; i < 12; i++) {
		classes.push(req.body["class" + i]);
	}
	student.classes = classes;
	student.save(function(err) {
		if (err) {
			next(err);
		} else {
			res.redirect('/schedule?token=' + req.body.token);
		}
	})
});


router.use(function(req, res, next) {
	if(req.student.admin) {
		next();
	} else {
		res.redirect('/');
	}
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




module.exports = router;
