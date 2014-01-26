var Forecast = require('forecast.io'),
express = require('express'),
routes = require('./routes'),
http = require('http'),
hue = require('node-hue-api'),
config = require('./config.js'),
path = require('path');

var app = express();

//Sets process.env variables for the application.
config.setup();

var options = {
  APIKey: process.env.FORECAST_API_KEY
},
forecast = new Forecast(options);




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: process.env.SESSIONS_SECRET }));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index)

app.get('/cluds.json', function(req, res){
	forecast.get(process.env.LATITUDE, process.env.LONGITUDE, function (err, response, data) {
	  if (err) throw err;
	  var cluds = data.hourly.data.map(function(hour) {return {hour: hour.time * 1000, cover: hour.cloudCover, precip: hour.precipProbability};});
	  var current = data.currently.summary;
	  var icon = data.currently.icon;
	  res.send({current: current, cluds: cluds, icon: icon});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


