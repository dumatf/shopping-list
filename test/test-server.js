var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
  it('should list items on GET', function(done) {
    chai.request(app)
        .get('/items')
        .end(function(err, res) {
          //how to interact with the err parameter ??
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].id.should.be.a('number');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
          done();
        });
  });
  it('should add an item on POST', function(done) {
    var itemsLength = storage.items.length
    chai.request(app)
        .post('/items')
        .send({name: 'Eggs'})
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.id.should.be.a('number');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('Eggs');
          //storage length should increase by 1
          storage.items.length.should.equal(itemsLength+1);
          done();
        });
  });
  it('should edit an item on PUT', function(done) {
    var itemsLength = storage.items.length;
    chai.request(app)
        .put('/items/0')
        .send({name: 'Bread'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.id.should.be.a('number');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('Bread');
          storage.items.length.should.equal(itemsLength);
          done();
        });
  });
  it('should delete an item on DELETE', function(done) {
    var itemsLength = storage.items.length;
    chai.request(app)
        .delete('/items/1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.id.should.be.a('number');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('Tomatoes');
          storage.items.length.should.equal(itemsLength-1);
          done()
        });
  });
  it('should add new item on PUT if id dne', function(done) {
    var itemsLength = storage.items.length;
    chai.request(app)
        .put('/items/1000')
        .send({name: 'Onions'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.id.should.be.a('number');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('Onions');
          storage.items.length.should.equal(itemsLength+1);
          done();
        });
  });
  it('should return an error on POST with no body', function(done) {
    chai.request(app)
        .post('/items')
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
  });
  it('should return an error on PUT with no body', function(done) {
    chai.request(app)
        .put('/items/0')
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
  });
});