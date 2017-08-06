var mailer = require('nodemailer');
var express = require('express');
var os = require('os');
var app = express();
var config = require('./config');

var transporter = mailer.createTransport(config.mailerTransport);





app.get('/', function(req, res) {
	res.send("<h1>" + req.protocol + "://" + req.get('host') + "</h1>");
	var link = req.protocol + "://" + req.get('host') + "/verify?token=";

	transporter.sendMail({
	    from: '"Cindr™" <cindrinc@gmail.com>',
	    to: "ishan.arya130@gmail.com",
	    subject: "Just wanted to make sure you exist!",
	    text: "Please visit the following link to verify your account: " + link,
	    html: '<img width=100 style="float: left; margin-right: 15px" src="https://lh3.googleusercontent.com/6qkG-ohrNRng2DgAXHIdCq80Fd4qC5qXYBFPjPtHcdSMP6blGX2bJhYJfJsbb1zh26NtCXdQORYzh9ppYaW6tQD27gyr2bytTj0JnNeegNjdzgl8OOYdq41Ra3JIkT16CkwkHH6zgPah6QOEcBkWKaquez2vFez2l7vPuo5Gq46quX9NSCvzXumYJR--t2LmpH8rYWMPICiJsduThPkEe3Zy9ofB1qWtvveaNbEpBHWb-LmNr0QropXDbUwWdyMdbslYvU9GTMnf-PKNdabuhhU0MFP0jjnPDdX_ddFRCbUatx3iJclXGBz14E2d7vqFpJJBDEuKXSresKuFrkXBefvVsMIaBf_dV0gQCempYXa1lS2UiWE5NcA6ubpG_C1bqfdg8lx4CTyfD5lKFIOeqxR9sHA_1dx9WfgCf235hPb7ixC7XxPNvRDdYEqQBI1l2ofxFXpire43hGP2uja6Qtv3r26zwRPRDGV_iRkwPvwIgamKzjn3Qn01DepB100RsOnGhuEGvYxxipmOZsVQslv1PnAU8fO5PQyRMAIkeOB9ewTA7AUvNkGXAgNPlo8efcHz1w4_2gwFTWXJoM_KOfF5BPi6dj1SoTIMLLwjRa9HWRiWDKXubQc=w906-h892-no"> <p>Thank you for registering with <b>IsThatGuyInMyClass.com</b>. Please visit the following link to verify your account:</p><br><a href="' + link + '">' + link + '</a>'
	}, function(err, info) {
	    if(err) {
	        console.error(err);
	    }

	    console.log("Message sent: ", info.messageId, info.response);
	});
});


app.listen(3000, function() {
    console.log("Server started on port: " + 3000);
    console.log("Link: " + os.hostname());
});