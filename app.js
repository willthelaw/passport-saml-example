var express = require('express'),
  express_session = require('express-session'),
  morgan = require('morgan'),
  http = require('http'),
  path = require('path'),
  passport = require("passport");

var env = process.env.NODE_ENV || 'development',
  config = require('./config/config')[env];

require('./config/passport')(passport, config);


var app = express();

  app.set('port', config.app.port);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(morgan('dev'));
  app.use(express_session(
    {
      secret: 'this shit hits'
    }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', { error: err }); 
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404',
      {
        url : req.url
      });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});


require('./config/routes')(app, config, passport);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
