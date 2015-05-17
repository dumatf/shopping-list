var unirest = require('unirest');

unirest.put('http://carbon-bolt-22-225776.use1-2.nitrousbox.com:8080/items/5').header('Accept', 'application/json').type('json').send({ name: "Korean Pears"}).end(function (res) {
  console.log(res.body);
});