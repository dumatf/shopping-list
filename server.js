var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function(name) {
  var item = {name: name, id: this.id};
  this.items.push(item);
  this.id += 1;
  return item;
};

Storage.prototype.remove = function(itemId) {
  var item = this.items[itemId];
  this.items.splice(itemId, 1);
  return item;
};

Storage.prototype.update = function(itemId, name) {
  // could alter data structure of
  // this.items to avoid full loop
  for (var i=0; i<this.items.length; i++) {
    if (this.items[i].id == itemId) {
      this.items[itemId].name = name;
      return this.items[itemId];
    }
  }
  return this.add(name);
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
// concept of express middlewares ??
app.use(express.static('public'));

app.get('/items', function(req, res) {
  res.json(storage.items);
});

// request is processed by jsonParser 1st
// is jsonParser itself a callback function ??
// processed by provided callback function 2nd
app.post('/items', jsonParser, function (req, res) {
  // if request does not include a body
  // send a 400 response
  // 400 == "Bad Request", malformed syntax
  if (!req.body.name) {
    return res.sendStatus(400);
  }
  
  var item = storage.add(req.body.name);
  res.status(201).json(item);
  // 201 == "Created", new resource created
});

app.delete('/items/:item_id', jsonParser, function( req, res) {
  var item = storage.remove(req.params.item_id);
  res.status(200).json(item);
});

app.put('/items/:item_id', jsonParser, function(req, res) {
  if (!req.body.name) {
    return res.sendStatus(400);
  }
  
  var item = storage.update(req.params.item_id, req.body.name);
  res.status(200).json(item);
});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;