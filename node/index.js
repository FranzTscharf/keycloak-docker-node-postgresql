var Keycloak = require('keycloak-connect');
var hogan = require('hogan-express');
var express = require('express');
var session = require('express-session');
const bodyParser = require("body-parser");

var app = express();
//Here we are configuring express to use body-parser as middle-ware.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at ', host, port);
});

app.set('view engine', 'html');
app.set('views', require('path').join(__dirname, '/view'));
app.engine('html', hogan);


app.get('/', function (req, res) {
  res.render('index');
});

var memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

var keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
  protected: '/protected/resource'
}));

app.post('/login', function (req, res) {
  // Example
  // curl --location --request POST 'http://localhost:3000/login' \
  // --header 'Content-Type: application/x-www-form-urlencoded' \
  // --data-urlencode 'client_id=nodejs-connect' \
  // --data-urlencode 'grant_type=password' \
  // --data-urlencode 'client_secre=mySecret' \
  // --data-urlencode 'username=user' \
  // --data-urlencode 'password=31n!w)6Je)MxP5$Zw&2rv'
  var axios = require('axios');
  var qs = require('qs');
  var data = qs.stringify(req.body);
  var config = {
    method: 'post',
    url: 'http://docker.for.mac.localhost:8080/auth/realms/nodejs-example/protocol/openid-connect/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  axios(config)
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (error) {
        res.json({type:"error", description:JSON.stringify(error)});
      });


});

app.get('/login', keycloak.protect(), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Authentication\n2. Login'
  });
});

app.get('/protected/resource', keycloak.enforcer(['resource:view', 'resource:write'], {
  resource_server_id: 'nodejs-apiserver'
}), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Access granted to Default Resource\n'
  });
});
