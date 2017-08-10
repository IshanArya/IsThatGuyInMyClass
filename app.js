var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');

// var nconf = require('nconf');
// nconf.file('config.json');

var mongoose = require('mongoose');
var db = mongoose.connect(config.mongodb.database, {
    useMongoClient: true
});
// var db = mongoose.connect('mongodb://' + nconf.get('db:username') + ':' + nconf.get('db:password') + '@localhost/local');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// json will look pretty in browser
app.set('json spaces', 2);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


var http = require('http');
var port = parseInt(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function() {
    console.log("Server started on port: " + port);
});

var shouldExit = false;
process.on('SIGINT', function() {
    if (shouldExit) {
        mongoose.disconnect();
        process.exit();
    } else {
        console.log('Press ^C again to exit');
        shouldExit = true;
    }
});
