/*
Module dependencies.
*/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var redis = require('redis');
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);

console.log("Redis url: process.env.REDISCLOUD_URL");

var rclient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
if (redisURL.auth) {
  rclient.auth(redisURL.auth.split(":")[1]);
}

var options = {title: 'frames'};

var client = redis.createClient();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  res.render('index', options);
});
app.get('/users', user.list);

app.get('/search/locations', function (req, res) {
  res.render('location_search', options);
});

app.get('/search/tags', function (req, res) {
  res.render('tag_search', options);
});
  
app.get('/images/location/:id', function (req, res) {
  options.location = req.params.id;
  res.render('location_gallery', options);
});
  
app.get('/images/tags/:tag1/:tag2', function (req, res) {
  var tags = [req.params.tag1, req.params.tag2];
  options.tags = tags;
  res.render('tag_gallery', options);
});

app.get('/collections/add/image/:id', function(req, res) {
  options.id = req.params.id;
  client.smembers('collections', function(err, value) {
    if (!err) {
      options.collections = value;
    }
    else {
      console.log(err);
    }
    res.render('add_to_collection', options);
  });
});

app.get('/images/collections/:id', function (req, res) {
  options.id = req.params.id;
  res.render('list_gallery', options);
});

app.get('/collections/:id', function (req, res) {
  client.smembers('collections.' + req.params.id, function(err, value) {
    if (!err) {
      options.id = req.params.id;
      options.collection = value;
      res.render('collection', options);
    }
    else {
      res.send(500);
    }
  });
});

app.get('/collections', function(req, res) {
  client.smembers('collections', function(err, value) {
    if (!err) {
      options.collections = value;
      res.render('collections', options);
    }
    else {
      res.send(500);
    }
  });
});

app.delete('/collections/:id', function(req, res) {
  client.srem(['collections', req.params.id], function(err, val) {
    if(!err) {
      console.log('Collection: ' + req.params.id + ' removed.');
      
      client.del('collections.' + req.params.id, function(err, val) {
        if (!err) {
          res.send(200);
        }
        else {
          console.log(err);
          res.send(500);
        }
      });
    }
    else {
      console.log(err);
      res.send(500);
    }
  });
});

app.get('/images/collections/:id/json', function(req, res) {
  client.smembers('collections.' + req.params.id, function(err, value) {
    if (!err) {
      console.log(value);
      res.send(value);
    }
    else {
      console.log(err);
      res.send(500);
    }
  });
});
  
app.post('/collections/:collection_id/add/image/:image_id', function (req, res) {
  
  client.sadd(['collections', req.params.collection_id], function(err, val) {
    if (!err) {
      console.log('Added collection: ' + req.params.collection_id);
    }
    else {
      console.log(err);
    }
  });
  
  var collection = 'collections.' + req.params.collection_id;
  console.log(collection);
  
  client.sadd([collection, req.params.image_id], function (err, val) {
    if(!err) {
      console.log('Image: ' + req.params.image_id + ' added to: ' + req.params.collection_id);
      res.send('Added image to collection!');
    }
    else {
      console.log(err);
      res.send(500);
    }
  });
  
});

app.delete('/collections/:collection_id/delete/image/:image_id', function(req, res) {
  console.log(req.params);
  client.srem(['collections.' + req.params.collection_id, req.params.image_id], function(err, val) {
    if(!err) {
      console.log('Image: ' + req.params.image_id + ' removed from: ' + req.params.collection_id);
      res.send(200);
    }
    else {
      res.send(500);
    }
  });
});
  
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
