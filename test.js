var mailer = require('nodemailer');
var config = require('./config');

var transporter = mailer.createTransport(config.mailerTransport);

transporter.sendMail({
	from: '"Cindr™" <cindrinc@gmail.com>',
	to: 'ishan.arya130@gmail.com',
	subject: 'Is this thing on?',
	text: 'Testing... 1... 2... Testing! Testing!',
	html: '<h1>How does this render?</h1>'
}, function(err, info) {
	if(err) {
		console.error(err);
	}

	console.log("Message sent: ", info.messageId, info.response);
});