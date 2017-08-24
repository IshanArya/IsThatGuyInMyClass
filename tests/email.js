var mailer = require('nodemailer');
var express = require('express');
var os = require('os');
var app = express();
var config = require('../config');

var transporter = mailer.createTransport(config.mailerTransport);
function sendVerificationEmail(email, link) {
    transporter.sendMail({
        from: '"Cindr™" <cindrinc@gmail.com>',
        to: email,
        subject: "Just to make sure you exist!",
        text: "Please visit the following link to verify your account: " + link,
        html: '<img width=100 style="float: left; margin-right: 15px" src="https://i.imgur.com/peXjWtg.png"> <p>Thank you for registering with <b>IsThatGuyInMyClass.com</b>. Please visit the following link to verify your account:</p><br><br><a href="' + link + '">' + link + '</a>'
    }, function(err, info) {
        if(err) {
            console.error(err);
        }

        console.log("Message sent: ", info.messageId, info.response);
    });
}





app.get('/', function(req, res) {
	res.send("<h1>" + req.protocol + "://" + req.get('host') + "</h1>");
	var link = req.protocol + "://" + req.get('host') + "/verify?token=";

	sendVerificationEmail("ishan.arya130@gmail.com", link);
});


app.listen(3000, function() {
    console.log("Server started on port: " + 3000);
    console.log("Link: " + os.hostname());
});