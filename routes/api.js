var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var mailer = require('nodemailer');
var Student = require('../model/student');
var config = require('../config');
var router = express.Router();


var secret = config.secret;

var transporter = mailer.createTransport(config.mailerTransport);


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
                    verified: false
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

                        res.json({
                            success: true,
                            message: "Registration successful. Check email."
                        });

                        transporter.sendMail({
                            from: '"Cindr™" <cindrinc@gmail.com>',
                            to: email,
                            subject: "Just wanted to make sure you exist!",
                            text: "Please visit the following link to verify your account: " + link,
                            html: '<img width=100 style="float: left; margin-right: 15px" src="https://lh3.googleusercontent.com/6qkG-ohrNRng2DgAXHIdCq80Fd4qC5qXYBFPjPtHcdSMP6blGX2bJhYJfJsbb1zh26NtCXdQORYzh9ppYaW6tQD27gyr2bytTj0JnNeegNjdzgl8OOYdq41Ra3JIkT16CkwkHH6zgPah6QOEcBkWKaquez2vFez2l7vPuo5Gq46quX9NSCvzXumYJR--t2LmpH8rYWMPICiJsduThPkEe3Zy9ofB1qWtvveaNbEpBHWb-LmNr0QropXDbUwWdyMdbslYvU9GTMnf-PKNdabuhhU0MFP0jjnPDdX_ddFRCbUatx3iJclXGBz14E2d7vqFpJJBDEuKXSresKuFrkXBefvVsMIaBf_dV0gQCempYXa1lS2UiWE5NcA6ubpG_C1bqfdg8lx4CTyfD5lKFIOeqxR9sHA_1dx9WfgCf235hPb7ixC7XxPNvRDdYEqQBI1l2ofxFXpire43hGP2uja6Qtv3r26zwRPRDGV_iRkwPvwIgamKzjn3Qn01DepB100RsOnGhuEGvYxxipmOZsVQslv1PnAU8fO5PQyRMAIkeOB9ewTA7AUvNkGXAgNPlo8efcHz1w4_2gwFTWXJoM_KOfF5BPi6dj1SoTIMLLwjRa9HWRiWDKXubQc=w906-h892-no"> <p>Thank you for registering with <b>IsThatGuyInMyClass.com</b>. Please visit the following link to verify your account:</p><br><a href="' + link + '">' + link + '</a>'
                        }, function(err, info) {
                            if(err) {
                                console.error(err);
                            }

                            console.log("Message sent: ", info.messageId, info.response);
                        });
                    }
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

// router.get('/similar', function(req, res) {
//     // 5980c7a55e359d104130ae41
//     var id = req.body.id;
// });

// function getRandomId() {
//     var dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
//     var num1 = Math.floor(Math.random() * 62);
//     var num2 = Math.floor(Math.random() * 62);
//     var num3 = Math.floor(Math.random() * 62);
//     var num4 = Math.floor(Math.random() * 62);
//     var num5 = Math.floor(Math.random() * 62);
//     var num6 = Math.floor(Math.random() * 62);
//     return dict[num1] + dict[num2] + dict[num3] + dict[num4] + dict[num5] + dict[num6];
// }


router.use(function(req, res) {
    res.json({
        success: false
    });
});

module.exports = router;
